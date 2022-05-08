const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const comments = mongoCollections.comments;


async function getCommentById(id) {
    if (!id || typeof id !== "string")
        throw 'Your input is empty, please provide an id to search';
    let commentCollection = await comments();
    let objId = ObjectId.createFromHexString(id);
    let comment = await commentCollection.findOne({ _id: objId });
    if (comment === null)
        throw 'This id did not put a comment, please try a new one';
    return comment;
}

async function getAllComments() {
    let commentCollection = await comments();
    let allComments = await commentCollection.find({}).toArray();
    return allComments;
}

async function addComment(postId, userId, content) {

    if (!postId || typeof postId !== "string")
        throw 'the postId you input must is string type';
    if (!userId || typeof userId !== "string")
        throw 'the userId you input must is string type';
    if (!content || typeof content !== "string")
        throw 'your input is empty, please input some content';

    let commentCollection = await comments();
    let newComment = {
        postId: postId,
        userId: userId,
        content: content,
        date: new Date().toLocaleDateString()
    }
    let insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo === null)
        throw 'Oh, something wrong, please try again';
    let newCommentId = insertInfo.insertedId;
    let commentCreated = await getCommentById(newCommentId.toHexString());

    await postsCollection.addCommentId(postId, newCommentId.toHexString());

    return commentCreated;
}

async function removeComment(postId, commentId) {
    if (!postId || typeof postId !== "string")
        throw 'the postId you input must is string type';
    if (!commentId || typeof commentId !== "string")
        throw 'the commentId you input must is string type';

    await postsCollection.removeCommentId(postId, commentId);

    let commentObjId = ObjectId.createFromHexString(commentId);
    let commentCollection = await comments();
    let deletionInfo = await commentCollection.removeOne({ _id: commentObjId });
    if (deletionInfo.deletedCount === 0) {
        throw `Oh! Something wrong when we remove this comment, please try again`;
    }
    return true;
}


module.exports={
    getCommentById,
    addComment,
    removeComment,
    getAllComments
}