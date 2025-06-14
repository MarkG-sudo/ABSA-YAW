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
            // return res.status(422).json({ error: "Invalid input format." });

        }

        const existingUser = await UserModel.findOne({ email: value.email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" });
        }

        // Hash the user's password
        const hashedPassword = bcrypt.hashSync(value.password, 10);


        // Save the new user into the database
        const profilePictureUrl = req.file?.path;

        // Save user into database (only once!)
        const newUser = await UserModel.create({
            ...value,
            password: hashedPassword,
            role: value.role || "user",
            avatar: profilePictureUrl,
        });

        // Load the email HTML template
        let emailHtml;
        try {
            emailHtml = fs.readFileSync(path.join(__dirname, '../utils/signup-mail.html'), 'utf8');
            // Replace placeholder with user's full name
            emailHtml = emailHtml.replace("{{name}}", `${value.firstName} ${value.lastName}`);
        } catch (fileError) {
            console.error('Error reading email template:', fileError.message);
            return res.status(500).json({ message: 'Error sending confirmation email.' });
        }


        // Send confirmation email
        try {
            await mailtransporter.sendMail({
                from: process.env.EMAIL_USER,  // Use email from your environment variable
                to: value.email,
                subject: 'Welcome to Agrigain! Your Account is Ready!',
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            return res.status(500).json({ message: 'Registration successful, but failed to send confirmation email.' });
        }

        // Respond with success message
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