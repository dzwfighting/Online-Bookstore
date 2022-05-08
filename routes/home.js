const express = require("express");
const router = express.Router();
const bookData = require("../data/book")
module.exports = router;

router.get("/home", async (req, res) => {
    console.log("home")
    let booksList = await bookData.getAll();
    if(booksList.length == 0){
        if (req.session.user){
            return res.status(200).render("home/home", {title: "Home Page",uName:req.session.user.username,
                status:false});
        }else {
            return res.status(200).render("home/home", {title: "Home Page",
                status:false});
        }

    }else {
        if (req.session.user){
            return res.status(200).render("home/home", {
                uName:req.session.user.username,
                title: "Home Page",
                content:"Popular books",
                status:true,
                books:booksList.slice(0,5),
            });
        }else {
            return res.status(200).render("home/home", {
                title: "Home Page",
                content:"Popular books",
                status:true,
                books:booksList.slice(0,5),
            });
        }

    }



});







