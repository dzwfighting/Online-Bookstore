const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
ObjectId = require('mongodb').ObjectID;

async function setAdminAccess(userId) {
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    let userObjId = ObjectId.createFromHexString(userId);
    let userCollection = await users();
    let userUpdateInfo = {
        Admin:true
    };
    let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not set Admin access successfully';
    }
    return this.getUserById(userId);
};

module.exports = {
    setAdminAccess
}