const express=require('express');
const router=express.Router();
const {getAllProducts,createProducts, updateProduct, deleteProduct, getSingleProduct, getAdminProducts, createReviewForProduct, getProductReviews, deleteReview}=require('../controller/productController.js');
const {verifyUserAuth,roleBasedAccess}=require('../middleware/userAuth.js');

// route.get('/products',getAllProducts);
router.route('/products')
.get(getAllProducts);

router.route('/admin/products')
.get(verifyUserAuth,roleBasedAccess('admin'),getAdminProducts);

router.route('/admin/product/create')
.post(verifyUserAuth,roleBasedAccess('admin'),createProducts);

router.route('/admin/product/:id')
.put(verifyUserAuth,roleBasedAccess('admin'),updateProduct)
.delete(verifyUserAuth,roleBasedAccess('admin'),deleteProduct);

router.route('/product/:id')
.get(getSingleProduct);
router.route('/review')
.put(verifyUserAuth,createReviewForProduct);
router.route('/admin/reviews')
.get(verifyUserAuth,roleBasedAccess('admin'),getProductReviews).delete(verifyUserAuth,roleBasedAccess('admin'),deleteReview);



module.exports=router;

