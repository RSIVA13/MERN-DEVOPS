const mongoose=require('mongoose');
const validator=require('validator');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[25,"Invalid name Please enter a name with fewer than 25 characters"],
        minLength:[3,"Name Should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Valid email"]

    },
    password:{
        type:String,
        required:[true,"Please enter Your Password"],
        minLength:[8,"Password should be greater then 8 characters"],
        select:false

    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{timestamps:true})

//password hashing
userSchema.pre('save',async function(next) {
    // 1st -updating profile(name,email,image) hashed password is hashed again
     // 2nd - update password
     if(!this.isModified('password')){
        return next()
     }
     this.password=await bcryptjs.hash(this.password,10);
     next()
     
})

// next() என்பது Mongoose-க்கு "நான் middleware வேலை முடித்துவிட்டேன், இப்போ நீ பின்தொடரவும்" என்று சொல்லும்.

// அதாவது, pre('save') முடிந்ததும், Mongoose save() action-ஐ தொடரும் (எ.கா: database-ல் save ஆகும்).

// next() கொடுக்காமல் விட்டால், execution அங்கேயே நிற்கும். (அதாவது save நடக்காது).


userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.verifyPassword=async function (userEnteredPassword) {
    return await bcryptjs.compare(userEnteredPassword,this.password)
    
}

//gen reset Token
userSchema.methods.generatePasswordResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire=Date.now()+30*60*1000 //30min
    return resetToken;
}


const User=mongoose.model('User',userSchema)
module.exports=User;