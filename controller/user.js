import { UserModel } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserValidator, registerUserValidator, updateUserValidator } from "../validators/user.js";


// Register a new user
export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        const existingUser = await UserModel.findOne({ email: value.email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" });
        }

        const hashedPassword = bcrypt.hashSync(value.password, 10);

        const newUser = await UserModel.create({
            ...value,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully!",
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

        const isPasswordCorrect = bcrypt.compareSync(value.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: "24h" }
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