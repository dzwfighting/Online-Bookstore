const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const admin = mongoCollections.admin;
//const userDate = require('./users');
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createAdmin(userName, email, password) {

    let newAdmin = { userName, email, password };
    adminFieldChecker(newAdmin);

    newAdmin.accoutType = "admin";
    userName = userName.toLowerCase();
    newAdmin.userName = userName;
    
    let adminOperate = null
    try{
        adminOperate = await getAdminByName(userName)
    }catch(e){
        //pass
    }
    if(adminOperate){
        throw `Username already exists!`
    }

    const adminCollection = await admin();
    const insertInfo = await adminCollection.insertOne(newadmin);
    if(insertInfo.insertedCount === 0)  { 
        throw 'creating new user failed'; 
    }

    return { adminInserted: true };
}

async function checkAdmin(userName, password) {
    if(!userName || !password) {
        throw 'userName or password not provided';
    }
    isValidName(userName);
    isValidPassword(password);
    userName = userName.toLowerCase();
    const adminCollection = await admin();
    const admin = await adminCollection.findOne({userName: userName});
    if(admin === null) {
        return false;
    }
    let result = await bcrypt.compare(password, admin.password);
    if(!result) return false
    return true;
}

async function getAdminIdByName(adminName) {

    if(!adminName) {
        throw "adminName not provided";
    }
    isValidName(adminName);
    
    const adminCollection = await admin();
    const admin = await adminCollection.findOne({ userName: adminName });
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
    const admin = await adminCollection.findOne({userName: adminName});
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
    let updateInfo = await adminCollection.updateOne({userName: adminName}, {$push: {books: bookId}});
    if(updateInfo.matchedCount === 0) throw `Failed to add book to admin: ${adminName}.`
    return { addbook: true};
}

async function isAdmin(username) { 
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

async function userIsAdmin(userName, bookId){
    if(!userName || !bookId) {
        throw "userName or bookId not supplied";
    }
    isValidName(userName);
    
    let admin = null
    try{
        admin = await getAdminByName(userName)
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
    var pwdRegex = /\S{8,}$/;
    const valid = pwdRegex.test(password);
    if(!valid) {
        throw 'password not valid';
    }
}

function isFieldExistChecker(param, paramName) {
    if(!param || param === undefined) {
        throw `You must provide ${paramName}`;
    }
}

function adminFieldChecker(params) {
    let allParams = ['userName', 'password'];  
    
    for(let key of allParams) {
        isFieldExistChecker(params[key], key);
    }
    
    isValidName(params.userName);
    isValidPassword(params.password);
}

module.exports = {createAdmin, checkAdmin, getAdminIdByName, getAdminByName, addBookToAdmin, isAdmin, userIsAdmin}
//module.exports = {isValidName, isValidPassword, checkAdmin, getAdminIdByName, getAdminByName, addBookToAdmin, isAdmin, userIsAdmin}
