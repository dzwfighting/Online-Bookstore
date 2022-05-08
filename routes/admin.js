const express = require('express');
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const bookData = data.book;
const usersData = data.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const xss = require('xss');
const { admin } = require('../data');


router.get('/login', async (req, res) =>{
    if(req.session.adminId){
        return res.redirect('/homepage');
    }
    else {
        res.render('admin/login', {
            title: 'admin Login',
            partial: 'login-script'
        });
    }
});


router.post('/login', async (req, res) =>{
    if(req.session.adminId){
        return res.redirect('/homepage');
    }
    else {
        let {username, password} = req.body;
        const allAdmin = await adminData.getAllAdmin();
        for(let x of allAdmin){
            if(username === x.username){
                if(await bcrypt.compare(password, x.password)){
                    req.session.adminId = x._id.toHexString();
                    res.redirect('/admin/profile');
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
router.post('/book/newBook', async (req, res) =>{
    try {
        let bookDataInfo = req.body;
        if (!bookDataInfo.bookName) throw "You must provide a string of book name";
    
        if (!bookDataInfo.author) throw "You must provide the author name";

        if (!bookDataInfo.description) throw "You must provide a string of book Description";
        
        if (!bookDataInfo.bookTag) throw "You must provide book genre";
       
        if (!bookDataInfo.price) throw "You must provide book price";

        if (!bookDataInfo.publicationDate) throw "You must provide a book publish time";

        if (!bookDataInfo.bookCovers) throw "You must provide book images";
        if (!bookDataInfo.content) throw "You must provide book images";

        
        const book = await bookData.create(
        req.body.bookName,
        bookDataInfo.author,
        bookDataInfo.description,
        bookDataInfo.bookTag,
        bookDataInfo.price,
        bookDataInfo.bookCovers,
        bookDataInfo.publicationDate,
        bookDataInfo.content
        );

        res.redirect('/book/single');
    }catch (e){
        return res.status(400).render("book/searchPage",{
            hasErrors: true,
            error : "Something wrong, please try again",
        })
    }
});



router.get('/book/newBook', async (req, res) => {
        if (req.session.adminId) {
        let userInformation = await admin.getAdminById(req.session.adminId);
        res.render('book/newBook', { userInformation, partial: "addBook-script", admin: true });
        }
        else {
            // res.render('admin/adminLogin', {
            //     title: 'admin Login',
            //     partial: 'login-script',
            //     message: "Add failed, please try again",
            //     error: "Add failed, please try again"
            return res.status(400).render("admin/login", {
                hasErrors: true,
                error: "Invalid admin username or password, please try again",
            });
        }
    // console.log("Add Book")

    // return res.render("admin/adminPage", {
    //     title:"Admin Page"
    // });

    
});



    
router.get('/profile',async(req,res)=>{
    if(!req.session.adminId){
        res.redirect('../admin/login')
    }
    let userInformation = await adminData.getAdminById(req.session.adminId);
    res.status(200).render('admin/adminPage',{
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

