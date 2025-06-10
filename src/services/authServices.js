import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";

export const registerUser = async ({ name, email, password, phone, address }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    verificationToken: verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  await user.save();
  return user;
};