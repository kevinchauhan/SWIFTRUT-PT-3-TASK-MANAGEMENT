import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import nodemailer from 'nodemailer'
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { Config } from '../config/index.js';

export class AuthController {
    async signup(req, res) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Invalid email" });
            }

            if (password.length < 6) {
                return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            }

            const existingUserByEmail = await User.findOne({ email });

            if (existingUserByEmail) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }


            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
            const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

            const newUser = new User({
                email,
                password: hashedPassword,
                name,
                image,
            });

            // await generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                success: true,
                user: {
                    ...newUser._doc,
                    password: "",
                },
            });
        } catch (error) {
            console.log("Error in signup controller", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            const isPasswordCorrect = await bcryptjs.compare(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            await generateTokenAndSetCookie(user._id, res);

            res.status(200).json({
                success: true,
                user: {
                    ...user._doc,
                    password: "",
                },
            });
        } catch (error) {
            console.log("Error in login controller", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("jwt-token");
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            console.log("Error in logout controller", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async self(req, res, next) {
        try {
            const user = await User.findById(req.user.id)
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user)
        } catch (error) {
            return next(error)
        }
    }

    async forgotPassword(req, res) {
        try {

            const { email } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).send("No account found with that email address.");
            }

            // Create a password reset token
            const token = crypto.randomBytes(20).toString("hex");

            // Set token to expire in 1 hour
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            // Save the token to the database
            await user.save();

            // Send the password reset link to the user's email
            const resetLink = `${Config.FRONTEND_URL}/reset-password?token=${token}`;

            const transporter = nodemailer.createTransport({
                service: "gmail", // Or any other email service
                auth: {
                    user: Config.EMAIL_USER, // Your email address
                    pass: Config.EMAIL_PASSWORD, // Your email password or app-specific password
                },
            });

            const mailOptions = {
                to: user.email,
                from: Config.EMAIL_USER,
                subject: "Password Reset Request",
                text: `You have requested a password reset. Please click the following link to reset your password: ${resetLink}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ success: false, message: "Error sending email" });
                }
                return res.status(200).send("Password reset link has been sent to your email.");
            });

        } catch (error) {
            console.log("Error in forgot controller", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        // Find user by reset token and check if it has expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send("Invalid or expired token.");
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).send("Password has been reset successfully.");
    };

}
