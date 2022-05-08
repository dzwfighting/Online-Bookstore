const connection = require('../config/mongoConnection');
const adminData = require("../data/admin");
const bookData = require("../data/book")

console.log("Working on seeding your database...");


async function main() {
  const db = await connection();
  await db.dropDatabase();

 let a = await adminData.createAdmin("admin1", "admin1");
 let a_userid = a._id.toHexString();
  console.log("admin1 add success");
  // await adminData.createAdmin("admin2", "fight@gmail.com", "admin2");
  // console.log("admin2 add success")
  // await adminData.createAdmin("admin3", "successful@gmail.com", "admin3");
  // console.log("admin3 add success")
  // let a = await bookData.create("xiao","ahah","nihaoma",["hah"],200,"/in",
  // "2002-2-2","dfsd");
  // let b = await bookData.create("xiaodini","ahah","nihaoma",["hah"],200,"/in",
  //     "2002-2-2","dfsd");
  
  console.log("Adminstrations have been created...");

}

main().catch((error) => {
    console.log(error);
});