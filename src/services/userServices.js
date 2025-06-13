import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateProfile = async (userId, updateData) => {
  // Không cho phép update email, role, password qua API này
  const { name, phone, address } = updateData;
  const user = await User.findByIdAndUpdate(
    userId,
    { name, phone, address },
    { new: true }
  );
  if (!user) throw new Error("User not found");
  return user;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return user;
};