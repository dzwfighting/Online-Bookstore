const express = require("express");
const router = express.Router();
const data = require("../data");
const bookData = data.book;
const userData = data.user;
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
router.get("/:userid", async (req, res) => {
    try{
        const userid = req.params.userid;
        const userInfo = await userData.getUserById(userid);
        const booksInShelf = []
        for (const i in userInfo.bookshelf){
            const bookInfo = bookData.get(i);
            booksInShelf.push(bookInfo);
        }

        res.status(200).render("bookshelf/bookshelfPage",{userInfo, booksInShelf});
      }catch(e){
        res.status(400).redirect('/home')
      }
    });