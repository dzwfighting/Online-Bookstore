const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require("mongodb");
const bcrypt = require('bcrypt');
const { get } = require('./book');
const res = require('express/lib/response');

async function registerUser(username,email,password){
    checkStr(email,'email');
    checkStr(username,'username');
    checkStr(password,'password');
    const userCollection = await users();
    let checkExist = await userCollection.find({username: username}).toArray();

    if(checkExist.length>=1){
        throw "username exists"
    }
    const hashPwd = await bcrypt.hash(password, 5);
    const newUser = {
        username:username,
        email:email,
        password:hashPwd,
        balance:0,
        vip:false,
        bookshelf:[],
        purHistory:[],
        reviews:[]
    }
    // newUser.accountType = "user";
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0){
        throw 'Could not add user';
    }
    const newId = insertInfo.insertedId;
    return this.getUserById(newId);
}

async function login(username,password){
    checkStr(username,'username');
    checkStr(password,'password');

    const userCollection = await users();
    let user = await userCollection.find({ username: username }).toArray()
    if(user.length < 1){
        throw "username or Password does not exist!"
    }
    let find = await bcrypt.compare(password, user[0].password)
    let obj = {};
    if (find==false){
        throw "Email or Password doesn\'t exist!"
    }else {
        obj['username'] = username;
        obj['userId'] = user[0]._id;
        obj['email'] = user[0].email;
        return obj;
    }

}



async function getUserById(userId){
    //checkStr(userId);
    if (!ObjectId.isValid(userId)) throw 'ID is not a valid Object ID';
    const userCollection = await users();
    let findId = ObjectId(userId);
    const findUser = await userCollection.findOne({_id:findId});
    if(findUser == null) throw 'No user with that id';
    findUser._id = findUser._id.toString();
    return findUser;
}

function checkStr(str,comment){
    if(str == null || str == undefined) throw `${comment} do not exist`;

    if(!str) throw `${comment} cannot be empty`;


    if(str === ' ') throw `invalid ${comment}`;

    if (str.trim().length === 0) throw `invalid ${comment}`;
    if (comment != 'password' ){
        if(typeof str != 'string') throw `${comment} must be string`;
    }


}
async function findUserByName(username){
    let userCollection=await users()
    try{
        const user=await userCollection.findOne({username:username});
        if(user===null){
            throw 'Cannot find this user!'
        }
        return user
    }catch(e){
        console.log(e);
    }

}
async function updateUserBalance(username,balance){
    let preUser=await findUserByName(username)
    let prevBalance=preUser.balance
    let curBalance=prevBalance+balance
    let newUser={
        balance:curBalance
    }
    const usersCollection=await users()
    const updatedInfo=await usersCollection.updateOne({username:username},{$set:newUser})
    if(updatedInfo.modifiedCount===0){
        throw 'Could not be updated'
    }
    let curUser=await findUserByName(username)
    return curUser
}
async function beVIP(username){
    let preUser=await findUserByName(username)
    let prevBalance=preUser.balance
    let curBalance=prevBalance-10
    let newUser={
        balance:curBalance,
        vip:true
    }
    const usersCollection=await users()
    const updatedInfo=await usersCollection.updateOne({username:username},{$set:newUser})
    if(updatedInfo.modifiedCount===0){
        throw 'Could not be updated'
    }
    let curUser=await findUserByName(username)
    return curUser
}
async function buyBooks(username,price,bookId){
    let preUser=await findUserByName(username);
    let book=await get(bookId);
    let prevBalance=preUser.balance;
    let shelfArr=preUser.bookshelf
    for(let i=0;i<shelfArr.length;i++){
        if(shelfArr[i]._id==bookId){
            throw "You already have this book,cannot buy twice."
        }
    }
    if(prevBalance<price){
        throw "You don't have sufficient money.Please recharge!"
    }else{
        let curBalance=prevBalance-price;
        shelfArr.push(book);
        let newUser={
            balance:curBalance,
            bookshelf:shelfArr,
        }
        const usersCollection=await users()
        const updatedInfo=await usersCollection.updateOne({username:username},{$set:newUser})
        if(updatedInfo.modifiedCount===0){
           throw 'Could not be updated'
    }
        let curUser=await findUserByName(username)
        return curUser
            
    }

    
    let newUser={
        balance:curBalance,

    }


}


module.exports = {
    registerUser,getUserById,login,updateUserBalance,beVIP,findUserByName,checkStr,buyBooks
}