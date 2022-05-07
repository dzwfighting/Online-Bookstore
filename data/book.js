const mongoCollections = require("../config/mongoCollections");
const books = mongoCollections.books;
const objId = require('mongodb').ObjectID;

module.exports = {
    //Get the book by ID 
       async get(id) {
           
           if (!id) throw "You must provide an id to search for";
           if (id.trim().length === 0) throw "The id must not be an empty string";
           if(id.constructor != objId){
               if(id.constructor == String){
               if(objId.isValid(id)){
                  
                   var obj = new objId(id)
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
        if (!bookTag) throw "You must provide book genre";
       
        if (!price) throw "You must provide book price";

        if (!publicationDate|| typeof publicationDate != 'string') throw "You must provide a book publish time";

        if (!bookCovers || typeof bookCovers != 'string') throw "You must provide book images";
        if (!content || typeof content != 'string') throw "You must provide book images";
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
                publicationDate: publicationDate,
                content: content,
                avgRating:0, //add avg rating
                reviews:[],
                rating:[]
                };
            
                const insertInfo = await bookCollection.insertOne(newBook);

                if (insertInfo.insertedCount === 0) throw "Fail to create book";

                const newId = insertInfo.insertedId.toString();
                const book = await this.get(newId);
              

                return book
           
        } 
      },
      async removeBookById(id) {
        if (!id) throw "An id must be provided";
        if (typeof id !== 'string') throw "The id must be a string";
        if (id.trim().length === 0) throw "The id must not be an empty string";
        var obj = new objId(id)
    
        const bookCollection = await books();
        const deletionInfo = await bookCollection.deleteOne({ _id: obj });
        if (deletionInfo.deletedCount === 0) {
            throw "Could not delete book";
        }
    
        return true;
    },
      async getAll() {
 
        const bookCollection = await books();
 
        
        const book = await bookCollection.find().toArray();

      
        if (book.length === 0) return [];
        
        return book;
    
    },
     similar(s, t, f) {
        if (!s || !t) {
            return 0
        }
        var l = s.length > t.length ? s.length : t.length
        var n = s.length
        var m = t.length
        var d = []
        f = f || 3
        var min = function(a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        var i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        let res = (1 - d[n][m] / l)
        return res.toFixed(f)
     },
    async searchBook(bookName){
        let bookArr=await this.getAll();
        let newBookArr=[]
        for(let i=0;i<bookArr.length;i++){
          if(this.similar(bookArr[i].bookName,bookName)>=0.4){
            newBookArr.push(bookArr[i])
          }
        }
        return newBookArr
    }

    }
   


    