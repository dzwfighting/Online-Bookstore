const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const admin = mongoCollections.admin;
const userDate = require('./users');
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createAdmin(username, email, password) {
    isValidEmail(email);
    if(!username || !password) {
        throw 'username or password not provided';
    }
    isValidName(username);
    isValidPassword(password);
    
    let checkExist = await adminCollection.find({username: username}).toArray();

    if(checkExist.length>=1){
        throw "admin exists"
    }
    const hashPwd = await bcrypt.hash(password, 5);
    const newAdmin = {
        username:username,
        email:email,
        password: hashPwd,
    }
    newAdmin.ifAdmin = true;

    const adminCollection = await admin();
    const insertInfo = await adminCollection.insertOne(newAdmin);
    if (insertInfo.insertedCount === 0){
        throw 'Could not add admin';
    }
    // const newId = insertInfo.insertedId;
    // return this.getAdminById(newId);
    return { adminInserted: true };
}

async function getAdminById(adminId){
    if (!adminId) throw 'adminId must be provided';
    
    if (typeof adminId != 'string' || !adminId.trim()) throw 'the input adminId is invalid';
    let parsedAdminId = ObjectId(adminId);
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

async function isManager(username){
    if(!username) {
        throw "username not supplied";
    }
    isValidName(username);
    const adminCollection = await admin();
    let find = adminCollection.findOne({userName: username})

    if(find){
        return true
    }

    return false
}




// async function checkAdmin(username, password) {
//     if(!username || !password) {
//         throw 'username or password not provided';
//     }
//     isValidName(username);
//     isValidPassword(password);
//     username = username.toLowerCase();
//     const adminCollection = await admin();
//     const admin = await adminCollection.findOne({username: username});
//     if(admin === null) {
//         return false;
//     }
//     let result = await bcrypt.compare(password, admin.password);
//     if(!result) return false
//     return true;
// }

async function getAdminIdByName(adminName) {

    if(!adminName) {
        throw "adminName not provided";
    }
    isValidName(adminName);
    
    const adminCollection = await admin();
    const admin = await adminCollection.findOne({ username: adminName });
    if(admin === null) {
        throw "admin not found";
    }
    return admin._id.toString();
} 

async function getAdminByName(adminName) {
    
    if(!adminName) {
        throw "adminName not provided";
    }
   
    isValidName(adminName);
    const adminCollection = await admin();
    const admin = await adminCollection.findOne({username: adminName});
    if(admin === null) {
        throw "admin not found";
    }
    admin._id = admin._id.toString();
    return admin;
}

//Admin function
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

async function isAdmin(username) { 
    if(!username) {
        throw "username not supplied";
    }
    isValidName(username);
    const adminCollection = await admin();
    let find = adminCollection.findOne({username: username})

    if(find){
        return true
    }

    return false
}

async function userIsAdmin(username, bookId){
    if(!username || !bookId) {
        throw "username or bookId not supplied";
    }
    isValidName(username);
    
    const admin = null
    try{
        admin = await getAdminByName(username)
    }
    catch(e){
        return false
    }

    let idFound = manager.books.find(x => x === bookId)
    return idFound
}

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

function isValidPassword(password) {
    // var pwdRegex = /\S{8,}$/;
    // const valid = pwdRegex.test(password);
    // if(!valid) {
    //     throw 'password not valid';
    // }
}

function isValidEmail(email) {
    if(typeof email !== 'string') {
        throw "email must be a string";
    }

    var emailRegex = /[a-zA-Z0-9_]{3,}@[a-z0-9]{3,}\.com$/;
    const valid = emailRegex.test(email);
    if(!valid) {
        throw `${email} is not vlaid for email`;
    }
}


function isFieldExistChecker(param, paramName) {
    if(!param || param === undefined) {
        throw `You must provide ${paramName}`;
    }
}

function adminFieldChecker(params) {
    let allParams = ['username', 'password'];  
    
    for(let key of allParams) {
        isFieldExistChecker(params[key], key);
    }
    
    isValidName(params.username);
    isValidPassword(params.password);
}

// module.exports = {createAdmin, checkAdmin, getAdminIdByName, getAdminByName, addBookToAdmin, isAdmin, userIsAdmin}
//module.exports = {isValidName, isValidPassword, checkAdmin, getAdminIdByName, getAdminByName, addBookToAdmin, isAdmin, userIsAdmin}
module.exports = {createAdmin, getAdminById, getAllAdmin, isManager}
