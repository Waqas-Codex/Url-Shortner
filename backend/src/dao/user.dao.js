import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const createUser = async ({ name, email, password }) => {
  const newUser = new User({
    name,
    email,
    password
  })
  await newUser.save()
  return newUser
};

export const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};