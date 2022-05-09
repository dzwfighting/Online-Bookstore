const express = require('express');
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const bookData = data.book;
const bcrypt = require('bcrypt');

const { admin } = require('../data');


router.get('/login', async (req, res) =>{
    if(req.session.adminId){
        return res.redirect('/admin/profile');
    }
    else {
       return  res.render('admin/login', {
            title: 'Admin Login',
            partial: 'login-script'
        });
    }
});


router.post('/login', async (req, res) =>{
    if(req.session.adminId){
        return res.redirect('admin/profile');
    }
    else {
        let {username, password} = req.body;
        const allAdmin = await adminData.getAllAdmin();
        for(let x of allAdmin){
            if(username === x.username){
                if(await bcrypt.compare(password, x.password)){
                    req.session.adminId = x._id.toHexString();
                    return res.redirect('/admin/profile');
                }
                break;
            }
        }
        return res.status(400).render("admin/login",{
                hasErrors:true,
                error : "Invalid admin username or password, please try again",
        })
    }


    
});

// add book
router.post('/addBook', async (req, res) =>{
    try {
        if (!req.body.newBookName) throw "Please fill all fields";
    
        if (!req.body.newAuthor) throw "Please fill all fields";

        if (!req.body.newDesc) throw "Please fill all fields";
        
        if (!req.body.newGenres) throw "Please fill all fields";
       
        if (!req.body.newPrice) throw "Please fill all fields";

        if (typeof parseInt(req.body.newPrice) != 'number' ) throw 'price must number';

        if (!req.body.newPublicationDate) throw "Please fill all fields";

        let dataFormat = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!dataFormat.test(req.body.newPublicationDate)) throw "Please input correct Date format"

        if (!req.body.newBookCovers) throw "Please fill all fields";
        if (!req.body.newContent) throw "Please fill all fields";

        
        const book = await bookData.create(
            req.body.newBookName,
            req.body.newAuthor,
            req.body.newDesc,
            req.body.newGenres,
            req.body.newPrice,
            req.body.newBookCovers,
            req.body.newPublicationDate,
            req.body.newContent
        );

        return res.redirect('/book/'+book._id);
    }catch (e){
        return res.status(400).render("book/newBook",{
            hasErrors: true,
            error : e
        })
    }
});



router.get('/book/newBook', async (req, res) => {
        if (req.session.adminId) {
             return res.render('book/newBook', {  partial: "addBook-script", admin: true });
        }
        else {
            return res.status(400).render("admin/login", {
                hasErrors: true,
                error: "Invalid admin username or password, please try again",
            });
        }


    
});



    
router.get('/profile',async(req,res)=>{
    if(!req.session.adminId){
        return res.redirect('/admin/login')
    }
    let userInformation = await adminData.getAdminById(req.session.adminId);
       return  res.status(200).render('admin/adminPage',{
        userInformation,
        partial: 'admin-script',
        admin: true
    })
});

router.get('/logout', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/homepage');
    }else {
        req.session.destroy();
        return res.redirect('/homepage');
    }
});


module.exports = router;

