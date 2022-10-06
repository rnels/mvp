const Comment = require('./db.js').Comment;

// TODO: Works with partial match now, but want to explore this further
// to possibly have it partial match only whole words
module.exports.getCommentsBySearchPartial = (search, likeCount=0) => {
  return Comment.find({search: { $regex: search }}).where('likeCount').gt(likeCount);
}

module.exports.getCommentsBySearch = (search, likeCount=0) => {
  return Comment.find({search}).where('likeCount').gt(likeCount);
}

module.exports.doesSearchExist = (search) => {
  return Comment.findOne({search});
}

module.exports.saveComments = (comments) => {
  let updatePromises = [];
  for (let comment of comments) {
    updatePromises.push(
      Comment.updateOne(
        {_id: comment._id},
        comment,
        {upsert: true}
      )
    );
  }
  return Promise.all(updatePromises);
}

module.exports.getAllSearches = () => {
  return Comment.distinct('search');
}
