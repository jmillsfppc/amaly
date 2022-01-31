const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sendEmail = require('../mailer/email')


// generate user activation code
const genCode = () => {
    const code = Math.random().toString(36).slice(2)
    return code;
}

//mailer testing
// sendEmail(
//     'jeremiahmills93@gmail.com', 
//     'Welcome to Amalyapp',
//     `Your activation code - ${genCode()}`,
//     `Your activation code - <b>${genCode()}</b>`
//     );



// User Auth Validation
exports.validateUser = async (req, res) => {
    try {

        if(req.cookies.user_jwt) {
            //verify the token
            const decoded = jwt.verify(req.cookies.user_jwt, process.env.JWT_SECRET) 

            //find user in DB using 
            const user = await User.findById({_id: decoded.id}).select('-__v -createdAt');
            // add user object to the req
            req.user = user;

            //send res to client
            res.status(200).json({
                status : "user found",
                data : user
            });
          
        }else {
            //send res to client
            res.status(200).json({
                status : "no user found"
            })
        }

        
        
    } catch (error) {
        res.status(401).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}

exports.protect = async (req, res, next) => {
    try {

        if(req.cookies.user_jwt) {
            //verify the token
            const decoded = jwt.verify(req.cookies.user_jwt, process.env.JWT_SECRET) 

            //find user in DB using 
            const user = await User.findById({_id: decoded.id}).select('-__v -createdAt');

            if(!user){
                throw Error('Sorry, the user no longer exits. Please signup')
            }
            // add user object to the req
            req.user = user;
            next();
          
        }else {
            //throw an errow
            throw Error('You are not logged in. Please login to gain access')
        }
        
    } catch (error) {
        res.status(401).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}

exports.signupUser = async (req, res, next) => {

    try {   
        let token;
        const user = await User.create({ username: req.body.username, email: req.body.email });
        // sign token
        token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn : '1h'})

        // send token to browser //
        res.cookie('user_jwt', token, { expires: new Date(Date.now() + 1 * 60 * 60 * 1000), httpOnly: true })

        // generate and send activaion code via 
        // email to user email address
        let activationCode = genCode()
        sendEmail(
            req.body.email, 
            'Welcome to Amalyapp',
            `Your activation code - ${activationCode}`,
            `Your activation code - <b>${activationCode}</b>`
            );
        user.activationCode = activationCode;
        user.save();
        
        //send res to client
        res.status(200).json({
            status : "success",
            data : user
        })
        
    } catch (error) {
        res.status(400).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
    
}

exports.activateUser = async (req, res, next) => {
    try {
        // connect to DB and activate user account status
        const user = await User.findById({_id: req.user.id}).select('+activationCode');
        if(!user) {
            throw Error('Sorry, no user found')
        }

        // compare activation code with DB activationCode
        if(req.body.code === user.activationCode){
            // update user account status to activated
            user.status = 'activated';
            user.activationCode = undefined;
            user.save()
        }else{
            throw Error('Invalid activation code')
        }

        //send res to client
        res.status(201).json({
            status : "success",
            data : user
        })

    } catch (error) {
        res.status(400).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}

exports.setUserPassword = async (req, res, next) => {
    try {       
        // connect to DB and update user password
        const user = await User.findById({_id: req.user.id});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashPassword;
        user.status = 'complete';
        user.save();

        res.status(201).json({
            status : "success",
            data : user
        })

    } catch (error) {
        res.status(400).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}

exports.loginUser = async(req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
         
        // find user using email
        const user = await User.findOne({email : email}).select('+password');
        if(!user){
            throw new Error('Invalid user credentials');
        } 
 
        // verify password
        const verified = await bcrypt.compare(password, user.password);
        if(verified){
            // sign token
            let token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn : '1h'})

            // save tokenExpiry in DB and 
            user.tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);
            user.save();
            
            // send token to browser //
            res.cookie('user_jwt', token, { expires: new Date(Date.now() + 1 * 60 * 60 * 1000), httpOnly: true })

            //send res to client
            res.status(200).json({
                status : "success",
                data : user
            })
        }else {
            throw new Error('Invalid user credentials');
        }
        
        
    } catch (error) {
        res.status(400).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}

// USER PHOTO EDIT

exports.editPhoto = async (req, res, next) => {
    
    try {
        // get user_id from req.cookies
        const user = await User.findById({_id : req.user.id});
        if(!user) {
            throw new Error('Sorry, no user found')
        }

        // update user doc and save
        user.photo = req.file.filename;
        user.save();

        //send res to client
        res.status(201).json({
            status : "success",
            data : user

        })
        
    } catch (error) {
        res.status(500).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
    
 
}

//  USER PROFILE EDIT //

exports.editProfile = async (req, res, next) => {
   
    try {
        // verify user in db using user._id
        const user = await User.findById({_id: req.user.id})
        if(!user) {
            throw new Error('No user found, please Login')
        }

        // if user === true, extract data req.body
        user.firstname = req.body.fname
        user.lastname = req.body.lname
        user.phone = req.body.phone
        req.body.facebook ? user.facebook = req.body.facebook : '';
        req.body.instagram ? user.instagram = req.body.instagram : '';
        req.body.linkedin ? user.linkedin = req.body.linkedin : '';

        // update user data and save doc
        user.save();

        //send res to client
        res.status(200).json({
            status : "success",
            data : user
        });
        
    } catch (error) {
        res.status(500).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}

// USER SETTINGS EDIT //

exports.editSettings = async (req, res, next) => {
    console.log(req.body)
    // get token from req.cookies.user_jwt
    const decoded = jwt.verify(req.cookies.user_jwt, process.env.JWT_SECRET);
    try {
         //verify user using id
        const user = await User.findById({_id : decoded.id}).select('+password');
        if(!user){
            throw new Error('No user found')
        }
        //if user === true verify passwords
        const isVerified = await bcrypt.compare(req.body.currentPassword, user.password);
        if(!isVerified){
            throw new Error('Wrong user password')
        }

        // if isVerified === true, encript new password and 
        // update user doc
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.newPassword, salt);
        user.email = req.body.email
        user.password = newPassword
        user.save({runValidators: true});

        //send res to client
        res.status(200).json({
            status : "success",
            data : user
        });

    } catch (error) {
        res.status(400).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
   
}

// CREATE SELLER ACCOUNT //
exports.sellerAccount = async(req, res) => {
    try {
        const {about, city, country, language} = req.body;
        const user = await User.findById({_id: req.user.id});
        user.about = about;
        user.city = city;
        user.country = country;
        user.language = language;
        user.seller = true
        user.save();

        //send res to client
        res.status(200).json({
            status : "success",
            data : user
        });

    } catch (error) {
        res.status(401).json({
            status : 'failed',
            error : error,
            message : error.message
        })
    }
}


// FIND ALL USERS //

exports.allUsers = async (req, res, next) => {
    try {

        const users = await User.find()
        res.status(200).json({
            status : 'success',
            results : users.length,
            data : users
        })
    } catch (error) {
        res.status(400).json({
            status : 'failed',
            message: error
        })
    } 

    
}


// LOGOUT USER //

exports.logout = (req, res) => {
    res.clearCookie('user_jwt');
    res.status(200).json({
        status : 'success'
    })
}