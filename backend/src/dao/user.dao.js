import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });
};

export const updateUserById = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData
  });
};