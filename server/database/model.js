const Comment = require('./db.js').Comment;

// TODO: Have this work with partial string match
module.exports.getComments = (search) => {
  return Comment.find({search});
}

module.exports.saveComments = (comments) => {
  return Comment.insertMany(comments);
}
