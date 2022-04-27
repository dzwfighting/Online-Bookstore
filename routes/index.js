const userRoutes = require("./users");
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const reportRoutes = require("./reports");
const main = require("./main");
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes);
    app.use("/comments", commentRoutes);
    app.use("/reports", reportRoutes);
    app.use("/home", main);

    app.get('/', (req, res) => {
        res.redirect('http://localhost:3000/homePage');
    });


    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;