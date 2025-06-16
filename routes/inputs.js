import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { VendorInputUpload } from "../middlewares/cloudinary.js";
import {
    createVendorAsset,
    getAllVendorAssets,
    updateVendorAsset,
    deleteVendorAsset,
    getMyVendorAssets
} from "../controller/inputs.js";

const vendorAssetRouter = express.Router();

vendorAssetRouter.post(
    "/assets",
    isAuthenticated,
    hasPermission("create_vendor_asset"),
    requireRole(["vendor"]),
    VendorInputUpload.array("images", 5),
    createVendorAsset
);

vendorAssetRouter.get(
    "/assets",
    isAuthenticated,
    hasPermission("get_vendor_asset"),
    requireRole(["vendor"]),
    getAllVendorAssets
);

vendorAssetRouter.patch(
    "/assets/:id",
    isAuthenticated,
    hasPermission("update_vendor_asset"),
    requireRole(["vendor"]),
    VendorInputUpload.array("images", 5),
    updateVendorAsset
);

vendorAssetRouter.delete(
    "/assets/:id",
    isAuthenticated,
    hasPermission("delete_vendor_asset"),
    requireRole(["vendor"]),
    deleteVendorAsset
);

vendorAssetRouter.get(
    "/assets/me",
    isAuthenticated,
    hasPermission("get_vendor_asset"),
    requireRole(["vendor"]),
    getMyVendorAssets
  );

export default vendorAssetRouter;
