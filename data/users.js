const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const admin = mongoCollections.admin;
const {ObjectId} = require("mongodb");
const bcrypt = require('bcrypt')
const helpcheck = require('../data/admin');

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
        vip:false
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

async function checkUser(userName, password) {
    // check whether userName and password are provided or not
    if(!userName || !password) {
        throw 'userName or password not provided';
    }
    
    // check whether userName and password are valid or not
    helpcheck.isValidName(userName);
    helpcheck.isValidPassword(password);
    
    const userCollection = await users();
    userName = userName.toLowerCase();
    const user = await userCollection.findOne({userName: userName});
    if(user === null) {
        return false;
    } 

    let result = await bcrypt.compare(password, user.password);
    if(!result) return false
    return true;

}

module.exports = {
    registerUser,getUserById,login,findUserByName, checkUser
}