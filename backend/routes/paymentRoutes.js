const express=require('express');
const { verifyUserAuth } = require('../middleware/userAuth');
const {processPayment, sendApiKey, paymentVerification} = require('../controller/paymentController');
const router=express.Router();


router.route('/payment/process').post(verifyUserAuth,processPayment);
router.route('/getkey').get(verifyUserAuth,sendApiKey);
router.route('/paymentVerification').post(paymentVerification);



module.exports=router;