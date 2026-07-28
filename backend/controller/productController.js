const prodSchema=require('../model/productModel.js');
const Order=require('../model/orderModel.js');
const HandleError=require('../utils/handleError.js');
const myErrorFun=require('../middleware/handleAsyncError.js');
const APIFunctionality = require('../utils/apiFunctionality.js');
const cloudinary = require('cloudinary').v2;
const fileUpload=require('express-fileupload');

// http://localhost:5000/api/v1/product/6822ec90e7035a67879aa78e?keyword=shirt


//1 Creating Product
const createProducts=myErrorFun(async(req,res,next)=>{
    let image=[];
    if(typeof req.body.image==='string'){
        image.push(req.body.image)
    }
    else{
        image=req.body.image
    }

    const imageLinks=[];
    for(let i=0;i<image.length;i++){
        const result=await cloudinary.uploader.upload(image[i],{
            folder:'products'
        })
        imageLinks.push({
            public_id:result.public_id,
            url:result.secure_url
        })
    }
    req.body.image=imageLinks
    // console.log(req.body);
    req.body.user=req.user.id
    // console.log(req.user);
    const Product=await prodSchema.create(req.body)
    res.status(201).json({success:true,Product})
})

// 2 get products
const getAllProducts=myErrorFun(async(req,res,next)=>{
    // console.log(req.query);
    const resultsPerPage=4;
    const apifunctionality=new APIFunctionality(prodSchema.find(),req.query).search().filter();
    // console.log(apifunctionality)
    // console.log(req.query);
    
    //Getting filtered query before pagination
    const filteredQuery=apifunctionality.query.clone();
    const productCount=await filteredQuery.countDocuments();
    // console.log(productCount);

    //calculate total pages based on filtered count
    const totalpages=Math.ceil(productCount/resultsPerPage);
    const page=Number(req.query.page) || 1;

    if(page>totalpages && productCount>0){
        return next(new HandleError("This page doesn't exist",404))
    }

    //apply pagination
    apifunctionality.pagination(resultsPerPage);
    const Products=await apifunctionality.query;

    if(!Products || Products.length===0){
        return next(new HandleError("No Product Found",404))
    }
    res.status(200).json({success:true,Products,productCount,resultsPerPage,
        totalpages,currentPage:page})

})

// 3 update product
const updateProduct=myErrorFun(async(req,res,next)=>{ //handle validation error
    // console.log(req.params.id);
    let Product=await prodSchema.findById(req.params.id);//if wrong id give in postman it gives null
    // console.log(Product);
     if(!Product){
        // return res.status(500).json({success:false,message:"Product Not found"})
        return next(new HandleError("Product Not Found",404) )
    }
    let images=[];
    if(typeof req.body.image==='string'){
        images.push(req.body.image)
    }
    else if(Array.isArray(req.body.image)){
        images=req.body.image
    }

    if(images.length>0){
       for(let i=0;i<Product.image.length;i++){
           await cloudinary.uploader.destroy(Product.image[i].public_id)
       }
       
       //upload new Images

       const imageLinks=[];
       for(let i=0;i<images.length;i++){
        const result=await cloudinary.uploader.upload(images[i],{
            folder:'products'
        })
        imageLinks.push({
            public_id:result.public_id,
            url:result.secure_url
        })
    }
    req.body.image=imageLinks;
    }

    Product=await prodSchema.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({success:true,Product})
})


// 4 Delete Product
const deleteProduct=myErrorFun(async(req,res,next)=>{
//     let Product=await prodSchema.findById(req.params.id);//if wrong id give in postman it gives null
    // console.log(Product);
    const Product=await prodSchema.findByIdAndDelete(req.params.id);
    if(!Product){
        // return res.status(500).json({success:false,message:"Product Not found"})
        return next(new HandleError("Product Not Found",404) )
    }
    for(let i=0;i<Product.image.length;i++){
       await cloudinary.uploader.destroy(Product.image[i].public_id)
    }
    res.status(200).json({success:true,message:"Product Delete Successful"})
})

// 5 get single Product
 const getSingleProduct=myErrorFun(async(req,res,next)=>{
    const Product=await prodSchema.findById(req.params.id);//if wrong id give in postman it gives null
    // console.log(Product);
    
    if(!Product){
        // return res.status(500).json({success:false,message:"Product Not found"})
        return next(new HandleError("Product Not Found",404) )
    }
    res.status(200).json({success:true,Product})
})

// 7 Creating and updating review
const createReviewForProduct=myErrorFun(async(req,res,next)=>{
    // console.log(req.body);
    // console.log(req.user.id);
    const {rating,comment,productId}=req.body;
     const product=await prodSchema.findById(productId);
    // console.log(product);
    if(!product){
    return next(new HandleError("Product Not Found",400))
}

 const order = await Order.findOne({
        user: req.user._id,
        "orderItems.product": productId,
        orderStatus: "Delivered"
    });

    if (!order) {
        return next(new HandleError("Buy Product Then Review", 400));
    }
    
    const review={
        user:req.user._id,
        name:req.user.name,
        order: order._id,
        rating:Number(rating),
        comment
    }
    const reviewExists=product.reviews.find(review=>review.user.toString()===req.user.id.toString())
    if(reviewExists){
        product.reviews.forEach(review=>{
            if(review.user.toString()===req.user.id.toString()){
                review.rating=rating;
                review.comment=comment;
            }
        })

    }else{
        product.reviews.push(review);
    }
    product.numOfReviews=product.reviews.length
    let sum=0;
    product.reviews.forEach(review=>{
        sum+=review.rating
    })
    product.ratings=product.reviews.length>0?(sum/product.reviews.length).toFixed(2):0
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        product
    })
    
})

// 8  Getting Reviews
const getProductReviews=myErrorFun(async(req,res,next)=>{
//  console.log(req.query.id);
const product=await prodSchema.findById(req.query.id);
if(!product){
    return next(new HandleError("Product Not Found",400))
}
res.status(200).json({
    success:true,
    reviews:product.reviews
})
 
})


//9 Deleting reviews
const deleteReview=myErrorFun(async(req,res,next)=>{
   const product=await prodSchema.findById(req.query.productId)
   if(!product){
    return next(new HandleError("Product Not Found",400))
}
const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString())
// console.log(reviews);
let sum=0;
reviews.forEach(review=>{
    sum+=review.rating
})
const ratings=reviews.length>0?sum/reviews.length:0;
const numOfReviews=reviews.length;
await prodSchema.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews
},{
    new:true,
    runValidators:true
})
res.status(200).json({
    success:true,
    message:"Review Delete Successfully"
})
})


// 6 Admin -getting all products
const getAdminProducts=myErrorFun(async(req,res,next)=>{
    const products=await prodSchema.find();
    res.status(200).json({
        success:true,
        products
    })
})



module.exports={getAllProducts,createProducts,updateProduct,deleteProduct,getSingleProduct,getAdminProducts,createReviewForProduct,getProductReviews,deleteReview}




