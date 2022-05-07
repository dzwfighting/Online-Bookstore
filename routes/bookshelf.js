const express = require("express");
const router = express.Router();
const data = require("../data");
const bookData = data.book;
const userData = data.users;
const bookshelfData = data.bookshelf;
const path = require('path');
const xss = require('xss');

//add book to bookshelf
router.post("/add", async (req, res) => {
 
    try{
      console.log("inbookshelf");
      const bookId = req.query.bookId;
      console.log("1");
      const userId = req.cookies.userid;
      console.log("2");
      const addInfo = await bookshelfData.addItem(userId, bookId);
      res.status(200).redirect("/bookshelf/"+userId);
   
    }catch(e){
      const userId = req.cookies.userid;
      errarr=[]
      errarr.push(e)
  
      res.status(400).redirect("/bookshelf/"+userId); 
   
    }
  });
//the page of bookshelf with userId
router.get("/:id", async (req, res) => {
    try{
        const userid = req.params.id;
        const userInfo = await userData.getUserById(userid);
        const bookNames = []
        const bookCoverss = []
        const bookContents = []
        // for (const i in userInfo.bookshelf){
        //     bookNames.push(i[0]);
        // }
        for(var i = 0; i < userInfo.bookshelf.length; i++){
            bookInfo = await bookData.get(userInfo.bookshelf[i].toString());
            bookNames.push(bookInfo.bookName);
            bookContents.push(bookInfo.content);
            bookCoverss.push(bookInfo.bookCovers);
        }
        res.status(200).render("bookshelf/bookshelfPage",{userInfo, bookNames,bookContents,bookCoverss});
      }catch(e){
        res.status(400).redirect('/home')
      }
    });
module.exports = router;