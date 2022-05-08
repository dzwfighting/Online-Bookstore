const express = require("express");
const router = express.Router();
const data = require("../data");
const bookData = data.book;
const userData = data.users;
const bookshelfData = data.bookshelf;
const path = require('path');
const xss = require('xss');

//add book to bookshelf
router.post("/add/:bookId", async (req, res) => {
 
    try{
      const bookId = req.params.bookId;
      const userId = req.session.user.userId;
      const addInfo = await bookshelfData.addItem(userId, bookId);
      res.status(200).redirect("/bookshelf/"+userId);
   
    }catch(e){

      const userId = req.session.user.userId;
        errarr=[]
        errarr.push(e)
        // res.status(400).json(errarr);
        res.status(400).redirect("/bookshelf/"+userId); 
   
    }
  });
//the page of bookshelf with userId
router.get("/:id", async (req, res) => {
    if(req.session.user){
      let userId=req.params.id;
      try{
        let user=await userData.getUserById(userId);
        if(user.bookshelf==null||user.bookshelf==[]){
          return res.render('bookshelf/bookshelfPage',{message:'You have no books yet.'})
        }
        return res.render('bookshelf/bookshelfPage',{user:user})
      }catch(e){
        return res.status(400).json({error:e})
      }

    }else{
      return res.redirect('/users/login')
    }
    });
module.exports = router;