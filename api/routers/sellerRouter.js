const express = require('express')
const router = express.Router();
const { protect, sellerAccount } = require('../controllers/authController')


// seller routes
router.route('/s/account/create').post(protect, sellerAccount)



module.exports = router