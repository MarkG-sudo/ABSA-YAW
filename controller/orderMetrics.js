
import OrderModel from "../model/order.js";
import ProduceModel from "../model/produce.js";
import VendorAssetModel from "../model/inputs.js";
import mongoose from "mongoose";

const getStartDate = (range) => {
    const now = new Date();
    if (range === "day") now.setDate(now.getDate() - 1);
    else if (range === "week") now.setDate(now.getDate() - 7);
    else if (range === "month") now.setMonth(now.getMonth() - 1);
    return now;
};

export const getUserOrderMetrics = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const role = req.auth.role; // vendor or farmer
        const { range = "week" } = req.query;
        const startDate = getStartDate(range);

        const orders = await OrderModel.find({ createdAt: { $gte: startDate } })
            .populate("itemId")
            .sort({ createdAt: -1 });

        const myOrders = orders.filter(order => {
            const item = order.itemId;
            return item && item.userId?.toString() === userId;
        });

        const groupedByDay = {};
        let totalOrders = 0;
        let totalQuantity = 0;
        let totalRevenue = 0;

        for (const order of myOrders) {
            const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
            const price = order.itemId?.price || 0;
            const amount = price * order.quantity;

            totalOrders++;
            totalQuantity += order.quantity;
            totalRevenue += amount;

            if (!groupedByDay[dateKey]) groupedByDay[dateKey] = [];
            groupedByDay[dateKey].push(order);
        }

        res.status(200).json({
            totalOrders,
            totalQuantity,
            totalRevenue,
            groupedByDay,
            orders: myOrders,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllOrdersMetricsAdmin = async (req, res, next) => {
    try {
        const { role, range = "month" } = req.query; // filter by farmer/vendor
        const startDate = getStartDate(range);

        const orders = await OrderModel.find({ createdAt: { $gte: startDate } })
            .populate("itemId buyerId")
            .sort({ createdAt: -1 });

        const filtered = orders.filter(order => {
            const owner = order.itemId?.userId;
            if (!owner) return false;
            return !role || owner.role === role;
        });

        const groupedByDay = {};
        let totalOrders = 0;
        let totalQuantity = 0;
        let totalRevenue = 0;

        for (const order of filtered) {
            const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
            const price = order.itemId?.price || 0;
            const amount = price * order.quantity;

            totalOrders++;
            totalQuantity += order.quantity;
            totalRevenue += amount;

            if (!groupedByDay[dateKey]) groupedByDay[dateKey] = [];
            groupedByDay[dateKey].push(order);
        }

        res.status(200).json({
            totalOrders,
            totalQuantity,
            totalRevenue,
            groupedByDay,
            orders: filtered,
        });
    } catch (error) {
        next(error);
    }
};
