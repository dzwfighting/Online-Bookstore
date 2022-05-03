const express = require("express");
const router = express.Router();
const multer = require('multer')
const data = require("../data");
const bookData = data.book;

const storage = multer.diskStorage({
      destination: function(req, file, cb){
          cb(null,'./uploads/')
      },
      filename: function(req, file, cb){
          cb(null,new Date().toISOString() + file.originalname)
      }
  })
const fileFilter = (req, file, cb)=>{
      if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            cb(null, true)
      }else{
            cb(null, false)
      }
}
const upload = multer({
      storage:storage, 
      fileFilter: fileFilter
  })
//Create books
router.post('/', upload.single('bookImage'),async (req, res) => { 
    try{
          
            if(typeof req.body.bookName !== 'undefined' && typeof req.body.bookAuthor !== 'undefined' 
            && typeof req.body.bookDescription !== 'undefined' && typeof req.body.bookGenre !== 'undefined' 
            && typeof req.body.bookPrice !== 'undefined' && req.file.path !== 'undefined'  
            && req.body.bookLanguage !== 'undefined' && req.body.bookPublishTime !== 'undefined' ){
               
              const book = await bookData.create(req.body.bookName, req.body.bookAuthor, 
                eq.body.bookDescription, req.body.bookGenre, req.body.bookPrice, 
                req.file.path, 
                req.body.bookLanguage, req.body.bookPublishTime)
          
             
              res.status(200).json({
                 message:"Create book successfully",
                 book: book
                })
            }else{
              throw 'Please fill all fields'
            }
        }catch(e){
            res.status(400).json({
              error:e
            })
        }
        
         
    });
//get book by id
router.get("/:id", async (req, res) => { 
    try{
        const bookId = req.params.id;
        const book = await bookData.get(bookId);
        return book;
    }catch(e){
        res.status(400).json({
            error:e
          })
    }
    
     
});

module.exports = router;