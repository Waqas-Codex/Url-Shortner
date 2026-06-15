import jwt from "jsonwebtoken"
import { nanoid } from "nanoid"
import { ENV } from "../config/env.js"
import { cookiesOptions } from "../config/config.js"

export const generateNanoId = (length) =>{
    return nanoid(length)
}



export const signToken = (payload) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: "5m"   // ✅ sirf JWT option
    })
}

export const verifyToken = (token) => {
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    return decoded;
}