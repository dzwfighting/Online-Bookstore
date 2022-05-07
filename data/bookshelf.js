const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const books = mongoCollections.books;
const bookData = require("./book");
const userData = require("./users");
const {ObjectId} = require("mongodb");
module.exports = {
        //add book to the bookshelf
        async addItem(userid, bookid) {
            if (!userid) throw "You must provide an id to search for user Id";
            if (!bookid) throw "You must provide an id to search for book Id";
            if(await userData.getUserById(userid) == null) throw "User doesn't exist!";
            if(await bookData.get(bookid) == null) throw "Book doesn't exist";
      
              if(typeof(userid) === 'string' || typeof(bookid) === 'string' ){
                if(ObjectId.isValid(userid)&&ObjectId.isValid(bookid)){
                  var userobj = new ObjectId(userid)
                  // var bookobj = new ObjectId(bookid)
                  const userCollection = await users();
                    var updatedUser = {
                          $push:{
                              bookshelf:{ id:bookid }
                          }
                      };
                      var updatedInfo = await userCollection.updateOne({ _id: userobj }, updatedUser);

      
                  
                  const user = userCollection.findOne({ _id: userobj });
                  if (updatedInfo.modifiedCount === 0) {
                    throw "could not update successfully";
                  }else{
                    console.log('Add item successfully');
                    return user;
                  }
      
                }else{
                  throw "It is not a valid id"
                }
              }else{
                throw "Please input Id as object Id or string"
              }
            
          },
          async deleteItem(userid, bookid) {
            if (!userid) throw "You must provide an id to search for user Id";
            if (!bookid) throw "You must provide an id to search for book Id";
            if(await userData.getUserById(userid) == null) throw "User doesn't exist!";
            if(await bookData.get(bookid) == null) throw "Book doesn't exist";
      
              if(typeof(userid) === 'string' || typeof(bookid) === 'string' ){
                if(ObjectId.isValid(userid)&&ObjectId.isValid(bookid)){
                  var userobj = new ObjectId(userid)
                  var bookobj = new ObjectId(bookid)
                  const userCollection = await users();

                    const deletionInfo = await userCollection.update({ _id : userobj },{$pull:{ 'bookshelf' : {id: bookobj} }});
                    const userAfterDelete = userCollection.findOne({ _id: userobj});

                    if (deletionInfo.deletedCount === 0) {
                      throw `Could not delete`
                    } else{
                        console.log('Delete item successfully');
                        return userAfterDelete;
                    };
      
                }else{
                  throw "It is not a valid id"
                }
              }else{
                throw "Please input Id as object Id or string"
              }
            
          }
}