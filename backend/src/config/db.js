import prisma from "./prisma.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully via Prisma");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;