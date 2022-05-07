const express = require("express");
const router = express.Router();
const multer = require('multer')
const data = require("../data");
const bookData = data.book;
const path = require('path');
const xss = require('xss');
// const storage = multer.diskStorage({
//       destination: function(req, file, cb){
//           cb(null,'./uploads/')
//       },
//       filename: function(req, file, cb){
//           cb(null,new Date().toISOString() + file.originalname)
//       }
//   })
// const fileFilter = (req, file, cb)=>{
//       if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
//             cb(null, true)
//       }else{
//             cb(null, false)
//       }
// }
// const upload = multer({
//       storage:storage, 
//       fileFilter: fileFilter
//   })

//Create books
router.post('/newBook', async (req, res) => { 

    let bookInData = {};
    bookInData.newBookName = xss(req.body.newBookName);
    bookInData.newBookCovers = xss(req.body.newBookCovers);
    bookInData.newContent = xss(req.body.newContent);
    bookInData.newAuthor = xss(req.body.newAuthor);
    bookInData.newGenres = [];
    bookInData.newPublicationDate = xss(req.body.newPublicationDate);
    bookInData.newPrice = xss(req.body.newPrice);
    bookInData.newDesc = xss(req.body.newDesc);
    for (let x of req.body.newGenres) {
      let strippedVal = xss(x);
      bookInData.newGenres.push(strippedVal);
  }

  let errors = [];

  // title error checking
  if (!bookInData.newBookName) {
      errors.push("A title must be provided");
  } else if (typeof bookInData.newBookName !== 'string') {
      errors.push(`The title must be a string`);
  } else if (bookInData.newBookName.trim().length === 0) {
      errors.push("The title must not be an empty string");
  } 

  // image error checking
  if (!bookInData.newBookCovers) {
      errors.push("An image must be provided");
  } else if (typeof bookInData.newBookCovers !== 'string') {
      errors.push(`The image must be a string`);
  } else if (bookInData.newBookCovers.trim().length === 0) {
      errors.push("The image must not be an empty string");
  } 

  // author error checking
  if (!bookInData.newAuthor) {
      errors.push("A author must be provided");
  } else if (typeof bookInData.newAuthor !== 'string') {
      errors.push(`The author must be a string`);
  } else if (bookInData.newAuthor.trim().length === 0) {
      errors.push("The author must not be an empty string");
  } 

  // genres error checking
  let genresTrim = [];
  if (!bookInData.newGenres) {
      errors.push("A genres array must be provided"); 
  } else if (bookInData.newGenres.length === 0) {
      errors.push("The genres array must have at least one genre");
  } else {
      for (let x of bookInData.newGenres) {
          if (x.trim().length === 0) {
              errors.push("The genres must not have an empty string");
              break;
          } else if (x.trim().length >= 50) {
              errors.push("The genres must be within 50 characters");
              break;
          }
          genresTrim.push(x.trim());
      }
  }



  // description error checking
  if (!bookInData.newDesc) {
      errors.push("A description must be provided");
  } else if (typeof bookInData.newDesc !== 'string') {
      errors.push(`The description must be a string`);
  } else if (bookInData.newDesc.trim().length === 0) {
      errors.push("The description must not be an empty string");
  } else if (bookInData.newDesc.trim().length >= 1000) {
      errors.push("The description must be within 1000 characters");
  }

  if (errors.length > 0) { 
      res.status(400).json({errors: errors});
      return;
  }

  try {
      const newBook = await bookData.create(bookInData.newBookName.trim(),
                                              bookInData.newAuthor.trim(),
                                              bookInData.newDesc.trim(),
                                              genresTrim,
                                              bookInData.newPrice.trim(),
                                              bookInData.newBookCovers.trim(),
                                              bookInData.newPublicationDate,
                                              bookInData.newContent.trim());
      
      res.redirect(`/book/${newBook._id}`);
  } catch (e) {
      res.status(400).json("some thing wrong");
  }
       
    });
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
        const bookId = xss(req.params.id);
        const book = await bookData.get(bookId);
        res.render('book/single',{book:book});

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