const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/comments');

console.log('MongoDB connected');

const commentSchema = new mongoose.Schema({
  commentId: String,
  username: String,
  userId: String,
  text: String,
  likeCount: Number,
  videoId: String,
  search: String
});

module.exports.Comment = mongoose.model('Comment', commentSchema);
