const express=require('express');
const {verifyUserAuth,roleBasedAccess}=require('../middleware/userAuth.js');
const {createNewOrder,allMyOrders, adminGetAllOrders, updateOrderStatus, deleteOrder, getSingleOrder}=require('../controller/orderController.js')
const router=express.Router();

router.route("/new/order").post(verifyUserAuth,createNewOrder);
router.route("/orders/user").get(verifyUserAuth,allMyOrders);
router.route("/order/:id")
.get(verifyUserAuth,getSingleOrder)
router.route("/admin/order/:id")
.put(verifyUserAuth,roleBasedAccess('admin'),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAccess('admin'),deleteOrder);
router.route("/admin/orders").get(verifyUserAuth,roleBasedAccess('admin'),adminGetAllOrders);



module.exports=router;