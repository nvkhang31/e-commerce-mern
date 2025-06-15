import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/userServices.js";

export const getProfileController = async (req, res) => {
  try {
    const user = await getProfile(req.user._id);
    res.status(200).json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    let updateData = req.body;
    if (req.file) {
      updateData.avatar = req.file.path; // URL từ Cloudinary
    }
    const user = await updateProfile(req.user._id, updateData);
    res.status(200).json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await changePassword(req.user._id, oldPassword, newPassword);
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};