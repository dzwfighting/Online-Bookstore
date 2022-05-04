const userRoutes = require("./users");
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const reportRoutes = require("./reports");
const homeRoutes = require("./home");
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes);
    app.use("/comments", commentRoutes);
    app.use("/reports", reportRoutes);
    app.use("/", homeRoutes);

//     app.get('/', (req, res) => {
//         res.redirect('/homePage');
//     });
//
//
    app.use("*", (req, res) => {
        res.status(500).redirect('/home');
    });
 };

module.exports = constructorMethod;