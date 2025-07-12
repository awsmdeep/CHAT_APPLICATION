import {catchAsyncError} from "../middleware/catchAsyncError.middleware.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateJWTToken} from "../utils/jwtToken.js"
import {v2 as cloudinary} from "cloudinary"



export const signup=  catchAsyncError(async(req,res,next)=>{
    const {fullName,email,password}=req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide complete details"
        });
    }

    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid email format"
        });
    }

    if(password.length<8){
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

    generateJWTToken(user,"User registered succesfully",201,res);


});
export const signin=  catchAsyncError(async(req,res,next)=>{

    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"enter the credentials for signIn",
        })
    }
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid email format"
        });
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid Credentials"
        });
    }
    const isPasswordMatched=await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        return res.status(400).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
    generateJWTToken(user,"User logged in succesfully",200,res);

    

});
export const signout=  catchAsyncError(async(req,res,next)=>{
        return res.status(200).cookie("token","",{
            httpOnly:true,
            maxAge:0,
            sameSite:"strict",
            secure:process.env.NODE_ENV !=="development" ? true:false,
        }).json({
            success:true,
            message:"User succesfully logged out",
        });

});
export const getUser=  catchAsyncError(async(req,res,next)=>{
    const user = req.user;
    return res.status(200).json({
        success:true,
        user,
    })
 
});
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { fullName, email } = req.body;
    
    // Fix validation logic
    if (!fullName || !email || fullName.trim().length === 0 || email.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "FullName and Email can't be empty.."
        });
    }
    
    const avatar = req?.files?.avatar;
    let cloudinaryResponse = {};
    
    if (avatar) {
        const oldAvatarPublicId = req.user?.avatar?.public_id;
        if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
            await cloudinary.uploader.destroy(oldAvatarPublicId);
        }
        
        cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "CHAT_APP_USER_AVATAR",
            transformation: [
                {
                    width: 300,
                    height: 300,
                    crop: "limit",
                },
                {
                    quality: "auto",
                },
                {
                    fetch_format: "auto"
                }
            ]
        });
    }
    
    let data = {
        fullName,
        email
    };
    
    if (avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url) {
        data.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }
    
    let user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user,
    });
});