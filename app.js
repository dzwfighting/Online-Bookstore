const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
const cookieParser = require("cookie-parser");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require('express-session');

app.use("/public", static);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    session({
      name: 'AuthCookie',
      secret: 'some secret string!',
      resave: false,
      saveUninitialized: true
    })
);

app.use(async (req, res, next) => {
    let currTimeStamp = new Date().toUTCString();
    let method = req.method;
    let routeUrl = req.originalUrl;
    let string = "";
    if(req.session.user) {
        string = "Authenticated User";
    } else {
        string = "Non-Authenticated User";
    }
    console.log(`[${currTimeStamp}]: ${method} ${routeUrl} (${string})`);
    next();
});

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});