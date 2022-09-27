const Comment = require('./db.js').Comment;

// TODO: Works with partial match now, but want to explore this further
// to possibly have it partial match only whole words
module.exports.getCommentsBySearchPartial = (search) => {
  return Comment.find({search: { $regex: search }});
}

module.exports.getCommentsBySearch = (search) => {
  return Comment.find({search});
}

module.exports.saveComments = (comments) => {
  let updatePromises = [];
  for (let comment of comments) {
    updatePromises.push(
      Comment.updateOne(
        {commentId: comment.commentId},
        comment,
        {upsert: true}
      )
    );
  }
  return Promise.all(updatePromises);
}
