const express = require('express');
const router = express.Router();
const data = require("../data");
const adminData = data.admin;
const usersData = data.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const xss = require('xss');

router.get("/login", async (req, res) => {
        console.log("log in")
        console.log(req.session)
        if (req.session.user) {
            return res.redirect("/adminPage");
        }else {
            return  res.render("admin/login", {
                title:"LogIn Page"
            }); 
        }
    });

router.post("/login",async (req,res)=>{
    if(req.body.username ==  '' || req.body.password ==  '' ) throw 'Please fill all fields';
    if (await adminData.isManager(req.body.username)) {
        req.session.user = { username: req.body.username, ifAdmin: true };
        res.redirect('/admin/profile')
        return
    } else {
         res.status(500).render('/admin/login', {title: "Login", error: 'The Username you input is not admin'})
        return
    }   
});

router.get('/profile', async (req, res) => {
    let saveduser = {}
    saveduser = req.session.user
    username = saveduser.username
    let user = await usersData.findUserByName(username)
    res.status(200).render('admin/adminPage', {
        user: user
    })
});

module.exports = router;

