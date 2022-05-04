const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/home", async (req, res) => {

    return res.render("home/home", {title: "Home Page"});
});







