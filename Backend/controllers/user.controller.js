import {catchAsyncError} from "../middleware/catchAsyncError.middleware.js"
import {User} from "../models/user.model.js"
import bcrypt from "bcryptjs"



export const signup=  catchAsyncError(async(req,res,next)=>{
    const {fullName,email,password}=req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide complete details"
        });
    }

    const emailRegex=/ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid email format"
        });
    }

    if(password.length()<8){
        return res.status(400).json({
            success:false,
            message:"Password must be at least 8 characters of length",
        })
    }

    const isEmailAlreadyUser= await User.findOne({email});
    if(isEmailAlreadyUser){
        return res.status({
            success:false,
            message:"Email is already registered",
        })
    }
    const hashPassword= await bcrypt.hash(password,10);
    const user= await User.create({
        fullName,
        email,
        password:hashPassword,
        avatar:{
            public_id:"",
            url:""
        },
    })


});
export const signin=  catchAsyncError(async(req,res,next)=>{
    

});
export const signout=  catchAsyncError(async(req,res,next)=>{
    

});
export const getUser=  catchAsyncError(async(req,res,next)=>{
    

});
export const updateProfile=  catchAsyncError(async(req,res,next)=>{
    

})