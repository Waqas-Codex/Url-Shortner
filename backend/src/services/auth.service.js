import bcrypt from "bcrypt";
import jsonwebtoken from  "jsonwebtoken"
import { createUser, findUserByEmail, findUserById, updateUserById } from "../dao/user.dao.js"
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
    const token = signToken({id: newUser.id})
    return {token, user: newUser}

}

export const userLogin = async (email, password) => {
    const user = await findUserByEmail(email)
    if(!user || !(await bcrypt.compare(password, user.password))){
        throw new Error("Invalid credentials")
        
    }
    
    const token =  signToken({id: user.id})
    return {token, user}
}

export const updateUserProfile = async (userId, updateData) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return await updateUserById(userId, updateData);
};