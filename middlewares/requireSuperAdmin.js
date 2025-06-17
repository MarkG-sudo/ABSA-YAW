import { UserModel } from "../model/user.js";

export const requireSuperAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth?.id);
        if (!user || !user.isSuperAdmin) {
            return res.status(403).json({ message: "Only the Super Admin can perform this action." });
        }
        next();
    } catch (error) {
        next(error);
    }
};
