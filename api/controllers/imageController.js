const multer = require('multer')
const sharp = require('sharp')
const firebaseStorage = require('../firebase/firebase');
const { ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage')


// Image Processing MULTER //
const storage = multer.memoryStorage();

// create upload method to handle files
exports.upload = multer({
    storage : storage,
    fileFilter : (req, file, cb) => {
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
            cb(null, true)
        }else{
            cb(null, false)
            req.fileError = 'Only .png, .jpg and .jpeg files allowed!';
        }
        
    },
    limits : {fileSize : 500000} //max-file size 0.5MB
});

// config Cloudinary
// cloudinary.config({ 
//     cloud_name: 'focusppc', 
//     api_key: '137114482427417', 
//     api_secret: 'FFoVl37qP3xcwdWHN7osY-LSDI8'
// });


// exports.uploadImage = (req, res, next) => {
//     upload.single('profilePic')(req, res, error => {
//        if (error instanceof multer.MulterError) {
//            // A Multer error occurred when uploading.
//            res.status(500).json({
//                status : 'failed',
//                error : error,
//                message : error.message
//            })
//            return;
//        }else{
//            next();
//        }
//     });
// }


exports.resizeImage = (req, res, next) => {
   // console.log(req.file)
   // check for file upload error from Multer
   if(req.fileError){
       res.status(500).json({
           status : 'failed',
           error : 'Image file format',
           message : req.fileError
       })
   }

   // set file name and storage using Sharp
   req.file.filename = `user$${req.user.id}.jpg`;
   
   sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpeg')
  .jpeg({quality: 90})
  .toFile(`public/uploads/users/${req.file.filename}`);

   next();
}

exports.uploadFiles = (req, res, next) => {
    let urls = [];
    for(let i = 0; i < req.files.length; i++){
        const storageRef = ref(firebaseStorage, `users/${req.user.id}/gigs/${req.body.title}/uploads-${i}`)
        const task = uploadBytesResumable(storageRef, req.files[i].buffer, {contentType: req.files[i].mimetype});
        task.on("state_changed", {
            'snapshot': null,
            'error': (err) => {
                console.log(err)
            },
            'complete': async () => {
                let url = await getDownloadURL(task.snapshot.ref)
                    // console.log(url)
                    urls.push(url);
                    req.gallery = urls
                    console.log(req.gallery)
            }
        })
    } 
    next()
    
}