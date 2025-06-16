import express from "express";
import { createProduce,  getAllProduce, updateProduce, deleteProduce, getMyProduce} from "../controller/produce.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { produceImageUpload } from "../middlewares/cloudinary.js"; 

const produceRouter = express.Router();

// Farmer produce routes
produceRouter.post("/produce", isAuthenticated, hasPermission("create_produce"), requireRole(["farmer"]), produceImageUpload.array("images", 10), createProduce);

produceRouter.get("/produce", isAuthenticated, hasPermission("get_produce"), requireRole(["farmer"]), getAllProduce);

produceRouter.get("/produce/me", isAuthenticated, hasPermission("get_produce"), requireRole(["farmer"]), getMyProduce);

produceRouter.patch("/produce/:id", isAuthenticated, hasPermission("update_produce"), requireRole(["farmer"]), produceImageUpload.array("images", 10), updateProduce);

produceRouter.delete("/produce/:id", isAuthenticated, hasPermission("delete_produce"), requireRole(["farmer"]), deleteProduce);

export default produceRouter;
