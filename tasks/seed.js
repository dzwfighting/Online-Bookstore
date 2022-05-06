const adminSeed = require('./seedAdmin');
// const userSeed = require('./seedUsers');
const reviewSeed = require('./seedReviews');
const connection = require('../config/mongoConnection');

console.log("Working on seeding your database...");

const allCollections = [adminSeed, reviewSeed];

const main = async () =>{
    
    for (const collection of allCollections) {
        await collection.seed()
  }
  const db = await connection();
  await db.serverConfig.close();

  console.log("Your database has been seeded!");
}

main().catch((e) => {
  console.log(e);
  }
)