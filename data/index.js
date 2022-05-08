const userData = require("./users");

const commentData = require("./comments");

const admiData = require("./admin");
const bookData = require("./book");
const bookshelfData = require("./bookshelf");
module.exports = {
    users: userData,
    admin: admiData,

    comments: commentData,

    book: bookData,
    bookshelf: bookshelfData
};