// routes/admin.js
import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { getAllUsers, updateUserStatus, deleteUser,changeUserRole} from "../controller/accountApproval.js";

const adminRouter = express.Router();

// Admin gets all users
adminRouter.get(
    "/admin/users",
    isAuthenticated,
    hasPermission("view_all_users"),
    requireRole(["admin"]),
    getAllUsers
);

// Admin updates user status (e.g., approve/suspend)
adminRouter.patch(
    "/admin/users/:id/status",
    isAuthenticated,
    hasPermission("update_user_status"),
    requireRole(["admin"]),
    updateUserStatus
);

// Admin deletes a user
adminRouter.delete(
    "/admin/users/:id",
    isAuthenticated,
    hasPermission("delete_user"),
    requireRole(["admin"]),
    deleteUser
);

//change User Role- demote or promote
// routes/admin.js

adminRouter.patch(
    "/admin/users/role/:userId",
    isAuthenticated,
    hasPermission("manage_users"),
    requireRole(["admin"]),
    changeUserRole
);
  


// // promote user to admin
// adminRouter.patch(
//     "/admin/users/:userId/promote",
//     isAuthenticated,
//     hasPermission("manage_users"),
//     requireRole(["admin"]),
//     promoteToAdmin
// );
  

export default adminRouter;
