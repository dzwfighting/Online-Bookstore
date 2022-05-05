const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require("mongodb");
const bcrypt = require('bcrypt')

async function setAdminAccess(userId) {
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    let userObjId = ObjectId.createFromHexString(userId);
    let userCollection = await users();
    let userUpdateInfo = {
        Admin:true
    };
    let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not set Admin access successfully';
    }
    return this.getUserById(userId);
};



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
    let newUser = {
        username:username,
        email:email,
        password:hashPwd,
        balance:0,
        vip:false
    }
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

module.exports = {
    setAdminAccess,registerUser,getUserById,login,findUserByName
}