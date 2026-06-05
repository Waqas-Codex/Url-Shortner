import jsonwebtoken from  "jsonwebtoken"
import User from "../models/user.model.js"
import { createUser, findUserByEmail } from "../dao/user.dao.js"
import { signToken } from "../utils/helper.js"

export const userRegister = async (name, email , password)=>{
    const user = await findUserByEmail(email)
    if(user){
        throw new Error("User already exists")
    }
   
     const newUser = await createUser({
        name,
        email,
        password
    })
    const token = signToken({id: newUser._id})
    return {token, user: newUser}

}

export const userLogin = async (email, password) => {
    const user = await findUserByEmail(email)
    if(!user || !(await user.comparePassword(password))){
        throw new Error("Invalid credentials")
    }
    
    const token =  signToken({id: user._id})
    return {token, user}
}