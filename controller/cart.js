import CartModel from "../model/cart.js";
import { addToCartValidator, updateCartItemValidator } from "../validators/cart.js";

export const addToCart = async (req, res, next) => {
    try {
        const { error, value } = addToCartValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const { itemId, itemModel, quantity } = value;
        const buyerId = req.auth.id;

        let cart = await CartModel.findOne({ buyerId });
        if (!cart) {
            cart = await CartModel.create({ buyerId, items: [{ itemId, itemModel, quantity }] });
        } else {
            const existingItem = cart.items.find(item => item.itemId.toString() === itemId && item.itemModel === itemModel);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ itemId, itemModel, quantity });
            }
            await cart.save();
        }

        res.status(200).json({ message: "Item added to cart", cart });
    } catch (err) {
        next(err);
    }
};

export const getCart = async (req, res, next) => {
    try {
        const buyerId = req.auth.id;

        const cart = await CartModel.findOne({ buyerId }).populate("items.itemId");

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ items: [], totalItems: 0, totalCost: 0, formattedTotalCost: "GHS 0.00" });
        }

        const formatCurrency = (amount) =>
            new Intl.NumberFormat('en-GH', {
                style: 'currency',
                currency: 'GHS',
            }).format(amount);

        let totalCost = 0;

        const enrichedItems = cart.items.map(({ itemId, quantity }) => {
            const price = itemId?.price || 0;
            const subtotal = price * quantity;
            totalCost += subtotal;

            return {
                name: itemId?.name || "Unknown item",
                quantity,
                category: itemId?.category,
                price: price,
                formattedPrice: formatCurrency(price),
                subtotal: subtotal,
                formattedSubtotal: formatCurrency(subtotal),
                images: itemId?.images || [],
            };
        });

        res.status(200).json({
            items: enrichedItems,
            totalItems: enrichedItems.length,
            totalCost,
            formattedTotalCost: formatCurrency(totalCost)
        });
    } catch (err) {
        next(err);
    }
};


export const updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { error, value } = updateCartItemValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const cart = await CartModel.findOne({ buyerId: req.auth.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.itemId.toString() === itemId);
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity = value.quantity;
        await cart.save();

        res.status(200).json({ message: "Item updated", cart });
    } catch (err) {
        next(err);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const cart = await CartModel.findOneAndUpdate(
            { buyerId: req.auth.id },
            { $pull: { items: { itemId } } },
            { new: true }
        );
        res.status(200).json({ message: "Item removed", cart });
    } catch (err) {
        next(err);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        await CartModel.findOneAndUpdate(
            { buyerId: req.auth.id },
            { $set: { items: [] } },
            { new: true }
        );
        res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
        next(err);
    }
};
