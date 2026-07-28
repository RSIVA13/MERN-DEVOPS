const myErrorFun = require('../middleware/handleAsyncError.js')
const instance=require('../razorpay.js')
const crypto=require('crypto')

const processPayment=myErrorFun(async(req,res)=>{
    const options={
        amount:Number(req.body.amount*100),
        currency:'INR'
    }
    const order=await instance.orders.create(options);
    res.status(200).json({
        success:true,
        order
    })
})

//send Api key
const sendApiKey=myErrorFun(async(req,res)=>{
    
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
        
    })
})

//Payment varification
const paymentVerification=myErrorFun(async(req,res)=>{
    // console.log(req.body);
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body;
    const body=razorpay_order_id +'|'+razorpay_payment_id
    const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex');
    // console.log('Expected Signature',expectedSignature);
    // console.log('Razorpay Signature',razorpay_signature);
    const isAuthentic=expectedSignature===razorpay_signature;
    if(isAuthentic){
        return res.status(200).json({
        success:true,
        message:"Payment verified Successfully",
        reference:razorpay_payment_id
    })
    }
    else{
        return res.status(400).json({
        success:false,
        message:"Payment verification failed",
        
    })
    }
    
})

module.exports={processPayment,sendApiKey,paymentVerification};