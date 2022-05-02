const mongoCollections = require("../mongoCollections");
const books = mongoCollections.books;
const objId = require('mongodb').ObjectID;

module.exports = {
    //Get the book by ID 
       async get(id) {
           
           if (!id) throw "You must provide an id to search for";
          
           if(id.constructor != objId){
               if(id.constructor == String){
               if(objId.isValid(id)){
                  
                   var obj = new objId(id)
                   const bookCollection = await books();
                  
                   const book = await bookCollection.findOne({_id:obj})
                   
                   if (book.length === 0) throw "No book with that id";
                   return book;
               }else{
                   throw "It is not a valid id"
               }
               }else{
               throw "Please input Id as object Id or string"
               }
           }else{
               const bookCollection = await books();
               const book = await bookCollection.findOne({_id:id})
               if (book.length === 0) throw "No book with that id";
               return book;
           }
       },
       //search by book name or author
       async getByKeyword(keyword) {
        if (!keyword || typeof keyword != 'string') throw "You must provide a keyword";
        try{
            let key = new RegExp('.*' + keyword + '.*', 'i');
            
            const bookCollection = await books();
            const book = await bookCollection.find({$or: 
                [
                    {bookName: key},
                    {bookAuthor: key},
                ]
            }).toArray();
          
            return book;
        }catch(e){
            throw e;
        }
        
    },
    // create books
       async create(bookName,bookAuthor, bookDescription, bookGenre, bookPrice, bookImage, bookLanguage,bookPublishTime, bookLocation) {
       
        if (!bookName|| typeof bookName != 'string') throw "You must provide a string of book name";
    
        if (!bookAuthor|| typeof bookAuthor != 'string') throw "You must provide the author name";

        if (!bookDescription|| typeof bookDescription != 'string') throw "You must provide a string of book Description";
        
        //genre will be an Object
        if (!bookGenre || typeof bookGenre != 'object') throw "You must provide book genre";
       
        if (!bookPrice|| typeof bookPrice != 'string') throw "You must provide book price";

        if (!bookLanguage|| typeof bookLanguage != 'string') throw "You must provide a book language";

        if (!bookPublishTime|| typeof bookPublishTime != 'string') throw "You must provide a book publish time";

        if (!bookImage) throw "You must provide book images";
        
        const bookCollection = await books();
       
        var checkExist = await bookCollection.find({bookName: bookName}).toArray();
    
        if(checkExist.length>=1){

           throw "Book exists"

        }else{
           
            let newBook = {
                bookName: bookName,
                bookAuthor: bookAuthor,
                bookImage: bookImage,
                bookDescription: bookDescription,
                bookGenre: bookGenre,//Array
                bookPrice:bookPrice,
                bookLanguage: bookLanguage,
                bookPublishTime: new Date(bookPublishTime),
                bookLocation: bookLocation,
                avgRating:avg, //add avg rating
                reviews:[],
                userRating:[]
                };
            
                const insertInfo = await bookCollection.insertOne(newBook);

                if (insertInfo.insertedCount === 0) throw "Fail to create book";

                const newId = insertInfo.insertedId;
                const book = await this.get(newId);
              

                return book
           
        } 
      },
      async getAll() {
 
        const bookCollection = await books();
 
        
        const book = await bookCollection.find().toArray();

      
        if (book.length === 0) throw "No book found";
        
        return book;
    
    }
    }