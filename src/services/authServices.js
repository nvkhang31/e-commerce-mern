import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";

export const registerUser = async ({ name, email, password, avatar }) => {
  if (!name || !email || !password) throw new Error("All fields are required");
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) throw new Error("User already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();
  const user = new User({
    name,
    email,
    password: hashedPassword,
    avatar,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  await user.save();
  return user;
};

export const verifyUserEmail = async (code) => {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid or expired verification code");
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  return user;
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) throw new Error("All fields are required");
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");
  if (!user.isVerified) throw new Error("Please verify your email before logging in");
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );
  return { user, token };
};

export const forgotUserPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpiresAt = resetPasswordExpiresAt;
  await user.save();
  return { user, resetPasswordToken };
};

export const resetUserPassword = async (token, password) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid or expired reset token");
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();
  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};