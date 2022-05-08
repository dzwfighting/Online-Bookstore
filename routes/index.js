const userRoutes = require("./users");
const adminRoutes = require("./admin");
const commentRoutes = require("./comments");
const homeRoutes = require("./home");
const bookRoutes = require("./book");
const bookshelfRoutes = require("./bookshelf"); 
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/admin", adminRoutes);
    app.use("/comments", commentRoutes);
    app.use("/", homeRoutes);
    app.use("/book", bookRoutes);
    app.use("/bookshelf", bookshelfRoutes);
    // Default page
    app.get('/', (req, res) => {
        res.redirect('/home');
    });

    app.use("*", (req, res) => {
        res.status(500).redirect('/home');
    });
 };

module.exports = constructorMethod;