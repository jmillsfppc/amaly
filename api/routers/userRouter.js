const express = require('express');
const router = express.Router();
const {
    loginUser,logout, signupUser,
    editPhoto, editProfile, validateUser, activateUser,
    setUserPassword, editSettings, protect
    } = require('../controllers/authController')
const {upload, resizeImage} = require('../controllers/imageController')

// auth routes //
router.route('/auth/validate').get(validateUser)

router.route('/auth/signup').post(signupUser);
router.route('/auth/activate').patch(protect, activateUser);
router.route('/auth/signup').patch(protect, setUserPassword);
router.route('/auth/login').post(loginUser);

router.route('/auth/logout').get(logout);


router.route('/u/account/profile').patch(protect, editProfile);
router.route('/u/account/settings').patch(protect, editSettings);
router.route('/u/account/photo').patch(protect, upload.single('profilePic'), resizeImage, editPhoto);


module.exports = router; 