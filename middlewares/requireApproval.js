import { UserModel } from "../model/user.js";

export const requireApproval = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Skip approval check for admin
        if (user.role === "admin") {
            return next();
        }

        // Only allow approved users
        if (user.status !== "approved") {
            return res.status(403).json({ message: "Account not approved by admin." });
        }

        next();
    } catch (error) {
        next(error);
    }
};
