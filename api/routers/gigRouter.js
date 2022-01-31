const express = require('express');
const router = express.Router();
const { createGig, getGig, updateGig } = require('../controllers/gigController')
const {protect} = require('../controllers/authController')
const { upload } = require('../controllers/imageController')


// create new Gig
router.route('/api/v1/gig').post(protect, upload.array('gallery[]'), createGig)

// get a gig
router.route('/api/v1/gig/:id').get(getGig).patch(protect, updateGig)

module.exports = router

