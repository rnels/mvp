const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/comments');

console.log('MongoDB connected');

const commentSchema = new mongoose.Schema({
  username: String,
  text: String,
  url: String,
  search: String
});

module.exports.Comment = mongoose.model('Comment', commentSchema);
