const express = require("express");
const router = express.Router();

const data = require("../data");
const bookData = data.book;

const xss = require('xss');
const { findUserByName } = require("../data/users");
const { get } = require("../data/book");


//Create books
 /**
 * Renders add new book page
 */

  router.get('/newBook', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('users/login');
        } else {
            res.render('book/newBook');
        }
    } catch (e) {
        res.status(500).json({
          error:e
        })
    }
});
router.get('/buy/:bookId',async(req,res)=>{
   try{
        if(!req.session.user){
          return res.redirect('/users/login')
        }
        else{
          let bookid=req.params.bookId
          let book=await get(bookid)
          let price=book.price
          let bookName=book.bookName
          let username=req.session.user.username;
          let newUser=await usersData.buyBooks(username,price,bookid)
          res.status(200).render('users/rechargeResult',{message:'You have bought '+bookName+' for '+price+' successfully!'})

        }
   }catch(e){
          res.status(400).render('users/rechargeResult',{error:e})
   }



})
router.post('/sort',async(req,res)=>{
      let term=req.body.term;
      try{
        if(term=='price'||term=='avgRating'){
          let sortedArr=await bookData.sortBook(term)
          return res.status(200).json({bookArr:sortedArr})
        }
        if(term=='time'){
          let sortedArr=await bookData.sortBookByDate()
           return res.status(200).json({bookArr:sortedArr})
        }

      }catch(e){
          return res.status(400).json({error:e})
      }







})
router.get('/getAll',async(req,res)=>{
  try{
    let bookArr=await bookData.getAll()
    return res.status(200).json({bookArr:bookArr})
  }catch(e){
    return res.status(400).json({error:e})
  }
})
router.get('/search',async (req,res)=>{
  return res.render('book/searchPage',{})
})
router.post('/result',async(req,res)=>{
  let bookName=req.body.term
  let bookArr=await bookData.searchBook(bookName)
  return res.status(200).json({bookArr:bookArr})
})
//get book by id
router.get("/:id", async (req, res) => { 
    try{
        let flag=false;
        const bookId = xss(req.params.id);
        const book = await bookData.get(bookId);
        if(book.description==null){
          book.description='N/A'
        }
        if(book.author==null){
          book.author='N/A'
        }
        if(book.avgRating==null){
          book.avgRating='N/A'
        }
        if(book.publicationDate==null){
          book.publicationDate='N/A'
        }
        if(book.price==null){
          book.price='N/A'
        }
        if(book.bookTag==null){
          book.bookTag="N/A"
        }
        if(book.reviews==null){
          book.reviews=[]
        }
        if(book.reviews.length==0||book.reviews==null){
          flag=true
        }
        res.render('book/single',{book:book,flag:flag});

    }catch(e){
        res.status(400).json(
            e
          );
    }
    
     
});
//Add rating to the book with bookId
router.post("/addRating/:bookId", async (req, res) => {
    try{
        const rating = req.body.rating;
        const bookId = req.params.bookId;
        const updateRating = await bookData.updateBookRating(bookId,rating);
        res.status(200).redirect(`/book/${bookId}`);
    }catch (e) {
        res.status(400).json(
            e
          );
    }

})

module.exports = router;