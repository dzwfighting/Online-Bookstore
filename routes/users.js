const usersData = require("../data/users");
const express = require("express");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const user=mongoCollections.users
module.exports = router;

// router.get("/", async (req, res) => {
//         if (req.session.user) {
//             return res.redirect("/homepage");
//         } else {
//             return res.render("users/login", {title: "LogIn Page"});
//         }
//     });
router.get("/signup", async (req, res) => {
        console.log("sign up")

        return  res.render("users/signup", {
            title:"Signup Page"
        });

    });

router.post("/signup",async (req, res) => {
        try {
            if(req.body.username ==  '' || req.body.email == '' || req.body.password == '') throw 'Please fill all fields';

            if(req.body.password != req.body.comfirm) throw "Password doesn't match"

            let mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if(!mail.test(req.body.email)) throw 'email format is not correct';
            let format_name = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
            if (format_name.test(req.body.username))throw "Don't contain special character like !@#$%^&*.,<>/\'\";:? in username";

            const user = await usersData.registerUser(req.body.username, req.body.email,req.body.password);
            // req.session.user = {
            //     username: req.body.username,
            //     userId:user._id,
            //     email: req.body.email
            // };
            return res.status(200).redirect("/homepage");
        }catch (e){
            return res.status(400).render("users/signup",{
                hasErrors: true,
                error : e,
            })
        }
    })

router.get("/login", async (req, res) => {
        console.log("log in")
        console.log(req.session)
        if (req.session.user) {
            return res.redirect("/users/profile");
        }else {
            return  res.render("users/login", {
                title:"LogIn Page"
            });
        }
    });

router.post("/login",async (req,res)=>{
        try {
            if(req.body.username ==  '' || req.body.password ==  '' ) throw 'Please fill all fields';
            const user = await usersData.login(req.body.username, req.body.password)
            req.session.user = {
                username: req.body.username,
                userId:user.userId,
                email:user.email
            };

            return res.status(200).redirect("/users/profile")
        }catch (e){
            return res.status(400).render("users/login",{
                hasErrors:true,
                error : e,
            })
        }
    });
router.get('/profile',async(req,res)=>{
        let saveduser={}
        saveduser=req.session.user
        username=saveduser.username
        let user=await usersData.findUserByName(username) 
        res.status(200).render('profile/info',{
           user:user
        })
})




