const mongoose = require('mongoose');

mongoose.connect(`${process.env.DB_HOST}/comments`, {
  user: process.env.DB_USER,
  pass: process.env.DB_PW
});

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
