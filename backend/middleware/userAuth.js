const myErrorFun=require('../middleware/handleAsyncError.js');
const jwt=require('jsonwebtoken');
const HandleError = require('../utils/handleError.js');
const User=require('../model/userModel.js')

const verifyUserAuth=myErrorFun(async(req,res,next)=>{
    const {token}=req.cookies;
    // console.log(token)

    if(!token){
        return next(new HandleError("Authentication is missing Please login to Access",401))
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECRET_KEY)
    // console.log(decodedData);
    req.user=await User.findById(decodedData.id);
    next()


})


const roleBasedAccess=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new HandleError(`Role -${req.user.role} is Not allowed to access the resource`,403))
        }
        next();
    }
}

module.exports={verifyUserAuth,roleBasedAccess};