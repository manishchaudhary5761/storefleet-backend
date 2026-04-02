import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // 📧 Welcome email
    await sendEmail({
      email: user.email,
      subject: "Welcome to StoreFleet",
      html: `<h1>Welcome ${user.name} 🚀</h1>`,
    });

    const token = generateToken(user);

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ LOGIN (SIGNIN)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ FORGOT PASSWORD (Better version)
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      html: `<p>Your reset token: ${resetToken}</p>`,
    });

    res.status(200).json({
      success: true,
      message: "Reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ RESET PASSWORD (Secure version)
import crypto from "crypto";
import { error } from "console";

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token expired or invalid",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateUserRole = async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.role = req.body.role;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated",
            user,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


