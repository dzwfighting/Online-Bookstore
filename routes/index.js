const main = require("./main");
const constructorMethod = (app) => {
    app.use("/home", main);








    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;