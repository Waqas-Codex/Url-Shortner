import pg from "pg"
import adapterPkg from "@prisma/adapter-pg"
const { PrismaPg } = adapterPkg
import prismaClientPkg from "@prisma/client"
const { PrismaClient } = prismaClientPkg
import { ENV } from "./env.js"

const pool = new pg.Pool({ connectionString: ENV.DATABASE_URL || process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma