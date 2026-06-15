import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = ["MONGO_URL", "JWT_SECRET", "FRONTEND_URL"];
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  throw new Error(`❌ Missing required environment variables: ${missingEnvs.join(", ")}`);
}

export const ENV = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
};
