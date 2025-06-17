import { UserModel } from "../model/user.js";
import { updateUserStatusValidator } from "../validators/accountApproval.js";
import { mailtransporter } from "../utils/mail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const { error, value } = updateUserStatusValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const targetUser = await UserModel.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ message: "User not found." });

        // Only the super admin can modify themselves
        if (targetUser.isSuperAdmin && req.auth.id !== targetUser._id.toString()) {
            return res.status(403).json({ message: "Only the Super Admin can modify their own account." });
        }

        if (targetUser.role === "super_admin") {
            return res.status(403).json({ message: "You cannot modify the Super Admin." });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { status: value.status },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        //  Send email if account is approved
        if (value.status === "approved") {
            try {
                let emailHtml = fs.readFileSync(
                    path.join(__dirname, "../utils/signup-mail.html"),
                    "utf8"
                );
                emailHtml = emailHtml.replace("{{name}}", `${updatedUser.firstName} ${updatedUser.lastName}`);

                await mailtransporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: updatedUser.email,
                    subject: "🎉 Your Agrigain Account Has Been Approved!",
                    html: emailHtml,
                });
            } catch (mailErr) {
                console.error("Failed to send approval email:", mailErr.message);
                // Don't block the request if email fails
            }
        }

        res.status(200).json({ message: "User status updated.", user: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found." });

        //  Prevent deleting Super Admin
        if (user.isSuperAdmin) {
            return res.status(403).json({ message: "Cannot delete the Super Admin." });
        }

        //  Send email notification before deletion
        try {
            let emailHtml = fs.readFileSync(
                path.join(__dirname, "../utils/account-deleted.html"),
                "utf8"
            );

            emailHtml = emailHtml.replace(/{{name}}/g, `${user.firstName}`);

            await mailtransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Your Agrigain Account Has Been Deleted",
                html: emailHtml,
            });
        } catch (err) {
            console.error("❗ Failed to send deletion email:", err.message);
            // Do not block deletion on email failure
        }


        // delete
        await user.deleteOne();

        res.status(200).json({ message: "User deleted." });
    } catch (error) {
        next(error);
    }
};
  

export const changeUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role: newRole } = req.body;

        const user = await UserModel.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });

        //  Prevent ANY modification of super admin role
        if (user.isSuperAdmin) {
            return res.status(403).json({ message: "The Super Admin's role cannot be changed." });
        }

        //  Prevent creating additional super admins
        if (newRole === "super_admin") {
            return res.status(403).json({ message: "Cannot assign super_admin role to another user." });
        }

        //  Prevent demoting the last admin
        if (user.role === "admin" && newRole !== "admin") {
            const adminCount = await UserModel.countDocuments({ role: "admin" });
            if (adminCount === 1) {
                return res.status(403).json({ message: "Cannot demote the only admin user." });
            }
        }

        user.role = newRole;
        await user.save();

        // Notify user of role change
        const emailTemplatePath = path.join(__dirname, "../utils/role-change.html");
        let emailHtml;
        try {
            emailHtml = fs.readFileSync(emailTemplatePath, "utf8");
            emailHtml = emailHtml
                .replace(/{{name}}/g, `${user.firstName}`)
                .replace(/{{newRole}}/g, user.role);
        } catch (err) {
            console.error("Error loading email template:", err.message);
        }

        try {
            await mailtransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Your Agrigain Account Role Has Been Updated",
                html: emailHtml || `Hello ${user.firstName}, your role has been changed to ${newRole}.`
            });
        } catch (err) {
            console.error("Failed to send role change email:", err.message);
        }

        res.status(200).json({ message: `User role updated to ${newRole}.`, user });
    } catch (error) {
        next(error);
    }
};

  





// export const promoteToAdmin = async (req, res, next) => {
//     try {
//         const { userId } = req.params;

//         const user = await UserModel.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found." });

//         user.role = "admin";
//         await user.save();

//         res.status(200).json({ message: "User promoted to admin.", user });
//     } catch (error) {
//         next(error);
//     }
//   };

