import jwt from "jsonwebtoken"

export const generateJWTToken= async(user,message,statusCode,res)=>{
    const token=jwt.sign({
        id:user.id
    })
}