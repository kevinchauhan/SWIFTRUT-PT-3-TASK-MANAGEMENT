import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

const authController = new AuthController()

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/self", authenticate, authController.self);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;