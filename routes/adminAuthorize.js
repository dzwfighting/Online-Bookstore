const express = require('express');
const router = express.Router();
const adminData = require('../data/admin');
const userData = require('../data/users');
// const book = require('../data/book');
// const commentsDate = require('../data/comments');


//const replies_DAL = require('../data/replies');
//const path = require('path');
//const fs = require('fs');
const multer = require('multer');
const xss = require('xss');

const upload = multer({ dest: '../uploads/' });

// router.get('/', async (req, res) =>{
//     try{
//         let userInformation;
//         if(req.session){
//             if(req.session.userId){
//                 userInformation = await userData.getUserById(req.session.userId);
//             } else if(req.session.adminId){
//                 userInformation = await adminData.getAdminById(req.session.adminId);
//             }
//         }
//         if(req.session.adminId){
//             res.redirect('admin/profile'); 
//         } else if(req.session.userId){
//             res.render('profile/info', {userInformation,partial:'landing-script', authenticated:true});
//         } else{
//             res.render('profile/info', {userInformation,partial:'landing-script', unauthenticated:true});
//         }
//     }catch (e){
//         res.render('error/error',{errors:e, partial:'error-script'})
//     }
// });


module.exports = router;