import { UserModel } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserValidator, registerUserValidator, updateUserValidator } from "../validators/user.js";
import { mailtransporter } from "../utils/mail.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register a new user
export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // Enforce ONE and ONLY ONE super admin
        if (value.role === "super_admin") {
            const existingSuperAdmin = await UserModel.findOne({ isSuperAdmin: true });

            if (existingSuperAdmin) {
                return res.status(403).json({ message: "A Super Admin already exists. Cannot create another." });
            }

            // Only allow with secret
            if (req.body.adminSecret !== process.env.ADMIN_SECRET) {
                return res.status(403).json({ message: "Unauthorized to create Super Admin." });
            }

            value.status = "approved";
            value.isSuperAdmin = true;
        }

        // Restrict creating other admin roles unless done by Super Admin
        if (value.role === "admin") {
            const requestingUser = req.auth ? await UserModel.findById(req.auth.id) : null;
            if (!requestingUser?.isSuperAdmin) {
                return res.status(403).json({ message: "Only the Super Admin can create admin accounts." });
            }

            if (req.body.adminSecret !== process.env.ADMIN_SECRET) {
                return res.status(403).json({ message: "Invalid admin secret." });
            }

            value.status = "approved";
            value.isSuperAdmin = false;
        }

        // Prevent isSuperAdmin from being manually passed in
        delete value.isSuperAdmin;

        // Proceed with user creation
        const existingUser = await UserModel.findOne({ email: value.email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" });
        }

        const hashedPassword = bcrypt.hashSync(value.password, 10);
        const profilePictureUrl = req.file?.path;

        const newUser = await UserModel.create({
            ...value,
            password: hashedPassword,
            role: value.role || "user",
            avatar: profilePictureUrl,
        });

        // Send email

        res.status(201).json({
            message: `Registration successful! Welcome to Agrigain, ${value.firstName}!`,
            userId: newUser._id,
        });
    } catch (error) {
        next(error);
    }
};



// Sign in (login) user
export const signInUser = async (req, res, next) => {
    try {
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json({ error: "Account does not exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(value.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        //  Block unapproved users from logging in
        if (user.status !== "approved") {
            return res.status(403).json({
                error: "Your account has not been approved yet. Please wait for admin review."
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_PRIVATE_KEY,
            {
                algorithm: "HS256",
                expiresIn: "24h"
            }
        );

        res.json({
            message: "Sign In Successful!",
            accessToken: token,
            role: user.role,
            name : user.firstName

        });
    } catch (error) {
        next(error);
    }
};


// Get user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
    try {
        const { error, value } = updateUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        if (value.password) {
            value.password = bcrypt.hashSync(value.password, 10);
        }

        const updated = await UserModel.findByIdAndUpdate(req.auth.id, value, {
            new: true,
        }).select("-password");

        res.json({ message: "Profile updated!", user: updated });
    } catch (error) {
        next(error);
    }
};