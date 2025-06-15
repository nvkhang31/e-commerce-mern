import {
  registerUser,
  verifyUserEmail,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
  getUserById,
} from "../services/authServices.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../resend/email.js";

export const signup = async (req, res) => {
  try {
    const avatar = req.file ? req.file.path : undefined;
    const user = await registerUser({ ...req.body, avatar }); // <-- Sửa dòng này
    generateJWTToken(res, user._id);
    await sendVerificationEmail(user.email, user.verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await verifyUserEmail(req.body.code);
    await sendWelcomeEmail(user.email, user.name);
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 60 * 1000, // 5h
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...user._doc, password: undefined },
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { user, resetPasswordToken } = await forgotUserPassword(
      req.body.email
    );
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await resetUserPassword(token, password);
    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
