const { hasSubscribers } = require('diagnostics_channel');
const myErrorFun=require('../middleware/handleAsyncError.js');
const User=require('../model/userModel.js');
const HandleError=require('../utils/handleError.js');
const sendToken = require('../utils/jwtToken.js');
const sendEmail=require('../utils/sendEmail.js')
const crypto=require('crypto');
const cloudinary = require('cloudinary').v2;

const registerUser=myErrorFun(async(req,res,next)=>{
    const{name,email,password,avatar}=req.body;
    const myCloud=await cloudinary.uploader.upload(avatar,{
        folder:'avatars',
        width:150,
        crop:'scale'
    })
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    })
    
    sendToken(user,201,res);
})

const loginUser=myErrorFun(async(req,res,next)=>{
    const{email,password}=req.body;

    if(!email || !password){
        return next(new HandleError('Email or password Cannot be empty',400))
    }

    const user=await User.findOne({email}).select('+password');
    if(!user){
        return next(new HandleError('Invalid Email or Password',401))
    }
    
    const isPasswordValid=await user.verifyPassword(password);
    if(!isPasswordValid){
        return next(new HandleError("Invalid Email or Password",401))
    }
    sendToken(user,200,res);
})


//logout

const logout=myErrorFun(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'Successfully logout'
    })
})

// forgot password 
const requestPasswordReset=myErrorFun(async(req,res,next)=>{
    const {email}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return next(new HandleError("User Doesn't Exist",400))
    }
    let resetToken;
    try{
        resetToken=user.generatePasswordResetToken();
        // console.log(resetToken);
        await user.save({validateBeforeSave:false})

    }
    catch(error){
        return next(new HandleError("Could not save reset Token please Try again Later",500))
    }
    const resetPasswordURL=`${req.protocol}://${req.get('host')}/reset/${resetToken}`
    // console.log(resetPasswordURL);

    
    const message=`Use The following link to reset your password : ${resetPasswordURL}.\n\n This link is expire in 30 mins\n if you didn't request a message please ignore this message`;
    try{
//sendemail
        await sendEmail({
            email:user.email,
            subject:"Password Reset Request",
            message
        })
        res.status(200).json({
            success:true,
            message:`Email is send to ${user.email}`
        })
    }catch(err){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})
        return next(new HandleError("Email Could not be sent please Try again Later",500))

    }
    
})


//Reset Password
const resetPassword=myErrorFun(async(req,res,next)=>{
    // console.log(req.params.token);
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()} //30min ex link send 1'oclock expire 1.30 then reset the password at 1.15 so 1.30>1.15 true if i reset password is 1.40 then 1.30>1.40 false not work
    })
    if(!user){
        return next(new HandleError("Reset Password Token is invalid or has been expired",400))
    }
    const{password,confirmPassword}=req.body;
    if(password!==confirmPassword){
        return next(new HandleError("Password doesn't Match",400))
    }
    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);
})

//Get User Details
const getUserDetails=myErrorFun(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    // console.log(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

//update password
const updatePassword=myErrorFun(async(req,res,next)=>{
    const{oldPassword,newPassword,confirmPassword}=req.body;
    const user=await User.findById(req.user.id).select('+password');
    const checkPasswordMatch=await user.verifyPassword(oldPassword);
    if(!checkPasswordMatch){
        return next(new HandleError('Old Password is inCorrect',400))
    }
    if(newPassword!==confirmPassword){
        return next(new HandleError("Password doesn't match",400))
    }
    user.password=newPassword;
    await user.save();
    sendToken(user,200,res);
})

//updating User profile
const updateProfile=myErrorFun(async(req,res,next)=>{
    const{name,email,avatar}=req.body;
    const updateUserDetails={
        name,
        email
    }
    if(avatar!==''){
        const user=await User.findById(req.user.id);
        const imageId=user.avatar.public_id
        await cloudinary.uploader.destroy(imageId)
        const myCloud=await cloudinary.uploader.upload(avatar,{
        folder:'avatars',
        width:150,
        crop:'scale'
    })
    updateUserDetails.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
    }
    const user=await User.findByIdAndUpdate(req.user.id,updateUserDetails,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully",
        user
    })
})

//Admin - Getting User Info
const adminGetUsersList=myErrorFun(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

// Admin - Get single user
const adminGetSingleUser=myErrorFun(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    if(!user){
        return next(new HandleError(`User Doesn't Exist in this id: ${id}`,400))
    }
    res.status(200).json({
        success:true,
        user
    })
    
})

// Admin Changing User Role
const updateUserRole=myErrorFun(async(req,res,next)=>{
    const {role}=req.body;
    const {id}=req.params;
    const newUserData={
        role
    }
    const user=await User.findByIdAndUpdate(id,newUserData,{
        new:true,
        runValidators:true
    })
    if(!user){
        return next(new HandleError("User Doesn't Exist",400))
    }
    res.status(200).json({
        success:true,
        user

    })
})


// Admin delete user profile
const deleteUser=myErrorFun(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new HandleError("User Doesn't Exist",400))
    }
    const imageId=user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId)
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})



module.exports={registerUser,loginUser,logout,requestPasswordReset,resetPassword,getUserDetails,updatePassword,updateProfile,adminGetUsersList,adminGetSingleUser,updateUserRole,deleteUser};