import { UserModel } from "../model/user.js";

export const preventSuperAdminEdit = async (req, res, next) => {
    try {
        const targetUser = await UserModel.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (targetUser.role === "super_admin") {
            return res.status(403).json({ message: "Operation not permitted on Super Admin." });
        }

        // Attach the user to req for further use if needed
        req.targetUser = targetUser;

        next();
    } catch (error) {
        next(error);
    }
};
