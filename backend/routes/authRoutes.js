import express from "express";
import { forgotPassword, login, register, resetPassword, sendOTP, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login );
router.post("/register", register);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



export default router;