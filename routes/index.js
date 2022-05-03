const userRoutes = require("./users");
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const reportRoutes = require("./reports");
//const main = require("./main");
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes);
    app.use("/comments", commentRoutes);
    app.use("/reports", reportRoutes);
  //  app.use("/homepage", main);

//     app.get('/', (req, res) => {
//         res.redirect('/homePage');
//     });
//
//
//     app.use("*", (req, res) => {
//         res.status(404).redirect('/homepage')
//     });
 };

module.exports = constructorMethod;