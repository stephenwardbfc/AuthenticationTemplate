import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const sendToken = (req, user, res) => {
    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    return token;
}

export const register = async (req, res) => {

    console.log("Registering user:", req.body);
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10); // Ideally, you should hash the password here using bcrypt or similar library

        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store the hashed password
        });

        console.log(newUser);

        await newUser.save();

        sendToken(req, newUser, res);
        res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, username: newUser.username, email: newUser.email } });


    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        sendToken(req, user, res);
        res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username, email: user.email } });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}

export const getProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
}