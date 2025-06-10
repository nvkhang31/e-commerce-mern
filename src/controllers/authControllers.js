import { registerUser } from "../services/authServices.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
// import { sendVerificationEmail } from "../resend/email.js"; // Uncomment if you have this

export const signup = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    generateJWTToken(res, user._id);

    // await sendVerificationEmail(user.email, user.verificationToken); // Uncomment if you have this

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};