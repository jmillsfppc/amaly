const express = require('express')
const mongoose = require('mongoose');
const router = express.Router();
const Category = require('../models/categoryModel')


// controllers
const createCategory = async(req, res, next) => {
    try {
        const {category, subcategories} = req.body
       const newCategory = await Category.create({category, subcategories})

       if(!newCategory){
        throw Error('Sorry, something went wrong')
        }

    // send res to client
    res.status(201).json({
        status : 'success',
        data : newCategory
    });
    } catch (error) {
        res.status(401).json({
            status : 'failed',
            error : error,
            message : error.message
        });
    }
}

const allCategory = async (req, res, next) => {
    try {
        const categories = await Category.find().select('-__v -createdAt');

        // send res to client
        res.status(200).json({
            status : 'success',
            data : categories
        });
    } catch (error) {
        res.status(500).json({
            status : 'failed',
            error : error,
            message : error.message
        });
    }
}

const getCategory = async (req, res) => {
    // console.log(req.params);
    try {
        const category = await Category.find(req.params).select('-_id -__v -createdAt');
        // send res to client
        res.status(200).json({
            status : 'success',
            data : category[0]
        });
    } catch (error) {
        res.status(500).json({
            status : 'failed',
            error : error,
            message : error.message
        });
    }
}

// category routes
router.route('/api/v1/category').get(allCategory).post(createCategory);
router.route('/api/v1/category/:category').get(getCategory)


module.exports = router;