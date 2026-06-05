// authorize keliye middleware bana bosdike 

import User from "../models/user.model.js"
import { verifyToken } from "../utils/helper.js"

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try{
        const decoded = verifyToken(token)
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" })
    }
} 

export default authMiddleware; 