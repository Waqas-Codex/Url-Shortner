import axiosInstance from "../utils/axiosInstance";

export const LoginUser = async (password, email) =>{
const {data} = await axiosInstance.post('/auth/login', {password, email})
return data
}

export const registerUser = async (password, email, name) =>{
const {data} = await axiosInstance.post('/auth/register', {password, email, name})
return data
}


export const logoutUser = async () =>{
const {data} = await axiosInstance.post('/auth/logout')
return data
}


export const getCurrentUser = async () =>{
const {data} = await axiosInstance.get('/auth/me')
return data
}

export const updateUserProfile = async (formData) =>{
const {data} = await axiosInstance.put('/auth/profile', formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  }
})
return data
}
