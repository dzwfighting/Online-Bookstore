const express = require('express');
const router = express.Router();
const adminDate = require('../data/admin');
const book = require('../data/book');
const commentsDate = require('../data/comments');
//const replies_DAL = require('../data/replies');
//const path = require('path');
//const e = require('express');
//const fs = require('fs');
const multer = require('multer');
const xss = require('xss');

const upload = multer({ dest: '../uploads/' });

module.exports = router;