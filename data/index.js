const userData = require("./users");
const postData = require("./posts");
const commentData = require("./comments");
const reportData = require("./reports");
const admiData = require("./admin");
const bookData = require("./book");
module.exports = {
    users: userData,
    admin: admiData,
    posts: postData,
    comments: commentData,
    reports: reportData,
    book: bookData
};