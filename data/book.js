const mongoCollections = require("../config/mongoCollections");
const books = mongoCollections.books;
const objId = require('mongodb').ObjectID;

module.exports = {
    //Get the book by ID 
       async get(id) {
           
           if (!id) throw "You must provide an id to search for";
          
           if(id.constructor != ObjectID){
               if(id.constructor == String){
               if(ObjectID.isValid(id)){
                  
                   var obj = new ObjectID(id)
                   const bookCollection = await books();
                  
                   const book = await bookCollection.findOne({_id:obj})
                   
                   if (book.length === 0) throw "No book with that id";
                   return book;
               }else{
                   throw "It is not a valid id";
               }
               }else{
               throw "Please input Id as object Id or string";
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
                    {author: key},
                ]
            }).toArray();
          
            return book;
        }catch(e){
            throw e;
        }
        
    },
    // create books
       async create(bookName,author, description, bookTag, price, bookCovers,publicationDate, content) {
       
        if (!bookName|| typeof bookName != 'string') throw "You must provide a string of book name";
    
        if (!author|| typeof author != 'string') throw "You must provide the author name";

        if (!description|| typeof description != 'string') throw "You must provide a string of book Description";
        
        //genre will be an Object
        if (!bookTag || typeof bookTag != 'object') throw "You must provide book genre";
       
        if (!price|| typeof price != 'string') throw "You must provide book price";

        if (!publicationDate|| typeof publicationDate != 'string') throw "You must provide a book publish time";

        if (!bookCovers) throw "You must provide book images";
        
        const bookCollection = await books();
       
        var checkExist = await bookCollection.find({bookName: bookName}).toArray();
    
        if(checkExist.length>=1){

           throw "Book exists"

        }else{
           
            let newBook = {
                bookName: bookName,
                author: author,
                bookCovers: bookCovers,
                description: description,
                bookTag: bookTag,//Array
                price:price,
                publicationDate: new Date(publicationDate),
                content: content,
                avgRating:avg, //add avg rating
                reviews:[],
                rating:[]
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