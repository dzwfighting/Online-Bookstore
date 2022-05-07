const express = require('express');
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const usersData = data.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const xss = require('xss');


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
        res.status(401).render('admin/login', {message: "Invalid username or password", partial: 'login-script'});
    }
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

