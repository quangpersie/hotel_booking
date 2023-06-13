const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {verifyAccessToken} = require('../middlewares/index')

// render ui login
router.get('/login', userController.login);
// xu ly login
router.post('/login', userController.signin);
// render ui register
router.get('/register', userController.register);
// xu ly register
router.post('/register', userController.signup);
// xu ly logout
router.get('/logout', userController.logout);

// render ui edit profile
router.get('/edit-profile', verifyAccessToken, userController.editProfile);
// xu ly edit profile
router.post('/edit-profile', verifyAccessToken, userController.editProfileExec);
// render ui change password
router.get('/change-password', verifyAccessToken, userController.changePass);
// xu ly change password
router.post('/change-password', verifyAccessToken, userController.changePassExec);

// render ui forgot password
router.get('/forgot-password', userController.forgotPassword);
// xu ly send link reset email
router.post('/forgot-password', userController.goToLinkResetPwd);
// render ui yeu cau user nhap new password
router.get('/reset-password/:email', userController.passwordReset);
// xu ly reset password
router.post('/reset-password', userController.execReset);

module.exports = router;