const mongoose = require('mongoose');
const Gig = require('../models/gigModel');
const firebaseStorage = require('../firebase/firebase');
const { ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage')


exports.createGig = async (req, res, next) => {
    try {
        // upload data to DB
        const { 
            title, category, 
            subcategory, description, tags, 
            basicPackage, standardPackage, premiumPackage } = req.body
            const packages = [basicPackage, standardPackage, premiumPackage];
        const user = req.user.id;
        const gig = await Gig.create({user, title, category, subcategory, description, tags, packages, gallery: req.gallery })
        
      if(!gig){
          throw Error('Sorry, something went wrong')
      }
       // upload image files to Firebase
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
                const doc = await Gig.findById(gig._id);
                doc.gallery.push(url);
                doc.save()
            }
        })
    }

      // send res to client
      res.status(201).json({
          status : 'success'
      });

    } catch (error) {
        res.status(401).json({
            status : 'failed',
            error : error,
            message : error.message
        });
    }
}

exports.getGig = async(req, res) => {

}

exports.updateGig = async(req, res) => {
    
}