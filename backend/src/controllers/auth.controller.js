import { cookiesOptions } from "../config/config.js";
import { userRegister, userLogin, updateUserProfile } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { token, user } = await userRegister(name, email, password);

    res.cookie("accessToken", token, cookiesOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await userLogin(email, password);

    res.cookie("accessToken", token, cookiesOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};


export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: req.user
  })
}

export const updateProfile = async (req, res) => {
  try {
    const { name , username} = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (username) updateData.username = username;

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updateData.avatar = `${baseUrl}/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await updateUserProfile(req.user.id, updateData);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      }
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message || "Internal server error" });
  }
};
