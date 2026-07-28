const User=require('../model/userModel.js');
const prodSchema=require('../model/productModel.js');
const Order=require('../model/orderModel.js');
const HandleError=require('../utils/handleError.js');
const myErrorFun=require('../middleware/handleAsyncError.js');

//create Order
const createNewOrder=myErrorFun(async(req,res,next)=>{
    const{shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(200).json({
        success:true,
        order
    })
})

//Getting Single Order
const getSingleOrder=myErrorFun(async(req,res,next)=>{
  const order=await Order.findById(req.params.id).populate("user","name email")
  if(!order){
    return next(new HandleError("No order Found",404))
  }
  res.status(200).json({
    success:true,
    order
  })
})

//all my orders
const allMyOrders=myErrorFun(async(req,res,next)=>{
   const orders=await Order.find({user:req.user._id});
    if(!orders){
    return next(new HandleError("No order Found",404))
  }
  res.status(200).json({
    success:true,
    orders
  })

})

//admin get all orders
const adminGetAllOrders=myErrorFun(async(req,res,next)=>{
   const orders=await Order.find();
   let totalAmount=0;
   orders.forEach(order=>{
    totalAmount+=order.totalPrice
   })
   res.status(200).json({
    success:true,
    orders,
    totalAmount
   })
})


//Update Order Status
const updateOrderStatus=myErrorFun(async(req,res,next)=>{
  const order=await Order.findById(req.params.id);
  if(!order){
    return next(new HandleError("No Order Found",404))
  }
  if(order.orderStatus==='Delivered'){
     return next(new HandleError("This order is Already Delivered",404))
  }
  await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)
  ));
  order.orderStatus=req.body.status;
  if(order.orderStatus==='Delivered'){
     order.deliveredAt=Date.now()
  }
  await order.save({validateBeforeSave:false})
  res.status(200).json({
    success:true,
    order
  })

})

async function updateQuantity(id,quantity) {
    const product=await prodSchema.findById(id);
    if(!product){
      throw new Error("Product Not found")
    }
    product.stock-=quantity
    await product.save({validateBeforeSave:false})
}

// Delete Order
const deleteOrder=myErrorFun(async(req,res,next)=>{
  const order=await Order.findById(req.params.id);
  if(!order){
      return next(new HandleError("No order found",404))
    }
    if(order.orderStatus!=='Delivered'){
      return next(new HandleError("This order is under Proceesing Cannot Be Deleted",404))
    }

    // await Order.deleteOne(order);
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
    success:true,
    message:"Order Deleted Successfully"
  })
})

module.exports={createNewOrder,getSingleOrder,allMyOrders,adminGetAllOrders,updateOrderStatus,deleteOrder}
