const admin_DAL = require("../data/admin");

async function seed() {
  await admin_DAL.createManager("admin1", "111 maple street", "Newark", "New Jersey", "34343", "burgers@gmail.com", "678-888-4321", "admin1");
  await admin_DAL.createManager("admin2", "2 hungry street", "hungry", "Louisiana", "98765", "hungry@hippos.com", "345-234-1234", "admin2");
  await admin_DAL.createManager("admin3", "101 manager street", "flavortown", "Georgia", "76543", "flavor@gmail.com", "909-878-4545", "admin3");

  console.log("Adminstrations have been created...");
}

if (require.main === module) {
    seed();
}

module.exports = {
    seed
  };