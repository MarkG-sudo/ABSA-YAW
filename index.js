import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";
import farmerRouter from "./routes/farmer.js";
import vendorRouter from "./routes/vendor.js";
import investorRouter from "./routes/investor.js";
import buyerRouter from "./routes/buyer.js";
import produceRouter from "./routes/produce.js";
import vendorAssetRouter from "./routes/inputs.js";
import orderRouter from "./routes/order.js";
import adminRouter from "./routes/accountApproval.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkoutCart.js";
import metricsRouter from "./routes/orderMetrics.js";
import investmentRouter from "./routes/investment.js";


// Initialize Express app
const app = express();


// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1); 
    }
};
connectDB();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Register routes
app.use('/farmers', farmerRouter);
app.use('/users', userRouter);
app.use('/vendors', vendorRouter);
app.use('/investors', investorRouter);
app.use('/buyers', buyerRouter);
app.use(produceRouter);
app.use(vendorAssetRouter);
app.use(orderRouter);
app.use(adminRouter);
app.use(cartRouter);
app.use(checkoutRouter);
app.use(metricsRouter);
app.use(investmentRouter);




// Start server
const PORT = 5090;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

