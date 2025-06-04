import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";






//Connect to database
await mongoose.connect(process.env.MONGO_URI);

//Create Express app
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());




// sendNotifications(); 


//Define routes
app.use(userRouter); 

// mailtransporter.verify((error, success) => {
//     if (error) {
//         console.error("SMTP connection error:", error);
//     } else {
//         console.log("SMTP connection successful");
//     }
// });



//Listen to server
app.listen(5090, () => {
    console.log('App is running on port 5090')
});