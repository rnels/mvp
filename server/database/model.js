const Comment = require('./db.js').Comment;

// TODO: Works with partial match now, but want to explore this further
// to possibly have it partial match only whole words
module.exports.getComments = (search) => {
  return Comment.find({search: { $regex: search }});
}

module.exports.saveComments = (comments) => {
  return Comment.insertMany(comments);
}
