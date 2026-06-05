import { cookiesOptions } from "../config/config.js";
import { userRegister, userLogin } from "../services/auth.service.js";
import User from "../models/user.model.js";

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
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (username) {
      user.username = username;
    }

    if (req.file) {
      // Create a full URL to the avatar
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      user.avatar = `${baseUrl}/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
