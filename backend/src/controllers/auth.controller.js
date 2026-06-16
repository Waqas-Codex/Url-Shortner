import { cookiesOptions } from "../config/config.js";
import { userRegister, userLogin, updateUserProfile } from "../services/auth.service.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await userRegister(name, email, password);
  req.user = user

  res.cookie("accessToken", token, cookiesOptions);

  res.status(201).json({
    message: "User registered successfully",
    user: { name, email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await userLogin(email, password);
  req.user = user

  res.cookie("accessToken", token, cookiesOptions);



  res.status(200).json({
    message: "User logged in successfully",
    user: user,
  });
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

    const updatedUser = await updateUserProfile(req.user._id, updateData);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
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
