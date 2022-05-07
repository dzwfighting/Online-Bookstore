const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const admin = mongoCollections.admin;
const userData = require('./users');
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createAdmin(username, password){
    if (!username || typeof username != 'string' || !username.trim()) throw 'invalid username';
    if (!password || typeof password != 'string' || !password.trim()) throw 'invalid password';
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    var newAdmin = {
        username: username,
        password: hashedPassword,
        log_in_date: []
    }
    const adminCollection = await admin();
    let insertInfo = await adminCollection.insertOne(newAdmin);
    if (insertInfo.insertedCount === 0) throw 'Could not add user.';

    const newId = insertInfo.insertedId;
    const finuser = await getAdminById(newId.toString());

    return finuser;
}

async function getAdminById(adminId) {
    
    if (!adminId) throw 'adminId must be provided';
    
    if (typeof adminId != 'string' || !adminId.trim()) throw 'the input adminId is invalid';
    let parsedAdminId = ObjectId.createFromHexString(adminId);
    const adminCollection = await admin();
    let adminInfo = await adminCollection.findOne({_id:parsedAdminId});
    if (!adminInfo || adminInfo === null) throw 'no admin with the provided id';
    return adminInfo;
}


async function getAllAdmin(){
    const adminCollection = await admin();
    let allAdmin = await adminCollection.find({}).toArray();
    return allAdmin;
}


async function getAdminByName(username) {
    if(!username) {
        throw "username not provided";
    }
   
    isValidName(username);
    const adminCollection = await admin();
    try{
        const user=await adminCollection.findOne({username:username});
        if(user===null){
            throw 'Cannot find this user!'
        }
        return user
    }catch(e){
        console.log(e);
    }
}




//Admin function

/*
async function addBookToAdmin(bookId, adminName) {
    if(!bookId || !adminName) {
        throw "bookId or adminName not supplied";
    }
    isValidName(adminName);
    
    const admin = await getAdminByName(adminName);
    if(admin === null) {
        throw "admin not found";
    }

    const adminCollection = await admin();
    let updateInfo = await adminCollection.updateOne({username: adminName}, {$push: {books: bookId}});
    if(updateInfo.matchedCount === 0) throw `Failed to add book to admin: ${adminName}.`
    return { addbook: true};
}
*/


//Helper function
function isValidName(name) {
    if(name.length !== 0 && name.trim().length === 0) 
        throw "Invalid username only with empty spaces";

    var letterRegex = /^[a-zA-Z0-9_]{4,}$/;
    const valid = letterRegex.test(name);
    if(!valid) {
        throw `${name} is not valid for a username, minimum 4 characters!`;
    }
}


module.exports = { createAdmin, getAdminById, getAdminByName, getAllAdmin }
