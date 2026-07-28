const express=require('express');
const router=express.Router();
const {registerUser,loginUser, logout, requestPasswordReset, resetPassword, getUserDetails, updatePassword, updateProfile, adminGetUsersList, adminGetSingleUser, updateUserRole, deleteUser}=require('../controller/userController.js');
const {verifyUserAuth, roleBasedAccess}=require('../middleware/userAuth.js');


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);
router.route('/password/forgot').post(requestPasswordReset);
router.route('/reset/:token').post(resetPassword);
router.route('/profile').get(verifyUserAuth,getUserDetails);
router.route('/password/update').put(verifyUserAuth,updatePassword);
router.route('/profile/update').put(verifyUserAuth,updateProfile);

router.route('/admin/users').get(verifyUserAuth,roleBasedAccess('admin'),adminGetUsersList);

router.route('/admin/user/:id')
.get(verifyUserAuth,roleBasedAccess('admin'),adminGetSingleUser)
.put(verifyUserAuth,roleBasedAccess('admin'),updateUserRole)
.delete(verifyUserAuth,roleBasedAccess('admin'),deleteUser)

module.exports=router;