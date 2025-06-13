// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { generateVerificationToken } from "../utils/generateVerificationToken.js";
// import { generateJWTToken } from "../utils/generateJWTToken.js";
// import {
//   sendPasswordResetEmail,
//   sendResetSuccessEmail,
//   sendVerificationEmail,
//   sendWelcomeEmail,
// } from "../resend/email.js";
// import crypto from "crypto";

// export const signup = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const userAlreadyExists = await User.findOne({ email });
//     if (userAlreadyExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const verificationToken = generateVerificationToken();
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       verificationToken: verificationToken,
//       verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
//     });

//     await user.save();

//     generateJWTToken(res, user._id);

//     await sendVerificationEmail(user.email, verificationToken);

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       user: {
//         ...user._doc,
//         password: undefined,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const verifyEmail = async (req, res) => {
//   const { code } = req.body;
//   try {
//     const user = await User.findOne({
//       verificationToken: code,
//       verificationTokenExpiresAt: { $gt: Date.now() },
//     });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired verification code",
//       });
//     }
//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiresAt = undefined;
//     await user.save();

//     await sendWelcomeEmail(user.email, user.name);

//     res
//       .status(200)
//       .json({ success: true, message: "Email verified successfully" });
//   } catch (error) {
//     console.log("error verifying email", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: "Invalid email or password" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid email or password" });
//     }
//     if (!user.isVerified) {
//       return res.status(400).json({ success: false, message: "Please verify your email before logging in" });
//     }

//     // Tạo JWT token
// const token = jwt.sign(
//   { userId: user._id, role: user.role },
//   process.env.JWT_SECRET,
//   { expiresIn: "5h" }
// );

// res.cookie('token', token, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'strict',
//   maxAge: 5 * 60 * 60 * 1000 // 5h
// });

// res.status(200).json({
//   success: true,
//   message: "Login successful",
//   user: {
//     ...user._doc,
//     password: undefined,
//   },
//   token,
// });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie('token', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   });
//   res.status(200).json({ success: true, message: "Logout successful" });
// };

// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not found" });
//     }
//     const resetPasswordToken = crypto.randomBytes(32).toString("hex");
//     const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

//     user.resetPasswordToken = resetPasswordToken;
//     user.resetPasswordExpiresAt = resetPasswordExpiresAt;

//     await user.save();
//     await sendPasswordResetEmail(
//       user.email,
//       `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
//     );

//     res.status(200).json({
//       success: true,
//       message: "Password reset email sent successfully!",
//     });
//   } catch (error) {
//     console.log("error sending password reset email", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     console.log("req.body:", req.body);
//     const { password } = req.body;
//     console.log(token)
//     console.log(password)
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpiresAt: { $gt: Date.now() },
//     });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired reset token" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpiresAt = undefined;
//     await user.save();

//     await sendResetSuccessEmail(user.email);

//     res
//       .status(200)
//       .json({ success: true, message: "Password reset successfully" });
//   } catch (error) {
//     console.log("error resetting password", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const checkAuth = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, user: { ...user._doc, password: undefined } });
//   } catch (error) {
//     console.log("error checking auth", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

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
    const user = await registerUser(req.body);
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
