const dbConnection = require('../config/mongoConnection');
const adminData = require("../data/admin");
const bookData = require("../data/book")

console.log("Working on seeding your database...");


async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  let a = await adminData.createAdmin("admin1", "admin1");

  console.log("admin1 add success");
  
    console.log("Adminstrations have been created...");
    console.log('Done seeding database');
    await dbConnection.closeConnection();
}

main().catch((error) => {
    console.log(error);
});