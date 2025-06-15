import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { signup, verifyEmail, login, logout, forgotPassword, resetPassword, checkAuth } from '../controllers/authControllers.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/signup", upload.single("avatar"), signup);
router.post("/verify-email", verifyEmail);

router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get('/check-auth', verifyToken, checkAuth);

export default router;