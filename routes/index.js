const userRoutes = require("./users");
const adminRoutes = require("./admin");
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const reportRoutes = require("./reports");
const homeRoutes = require("./home");
const bookRoutes = require("./book");
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/admin", adminRoutes);
    app.use("/posts", postRoutes);
    app.use("/comments", commentRoutes);
    app.use("/reports", reportRoutes);
    app.use("/", homeRoutes);
    app.use("/book", bookRoutes);

    // Default page
    app.get('/', (req, res) => {
        res.redirect('/home');
    });

    app.use("*", (req, res) => {
        res.status(500).redirect('/home');
    });
 };

module.exports = constructorMethod;