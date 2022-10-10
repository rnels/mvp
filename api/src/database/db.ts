import mongoose from 'mongoose';

mongoose.connect(`${process.env.DB_HOST}/comments`, {
  user: process.env.DB_USER,
  pass: process.env.DB_PW
});

console.log('MongoDB connected');

const commentSchema = new mongoose.Schema({
  _id: String,
  username: String,
  userId: String,
  text: String,
  likeCount: Number,
  videoId: String,
  search: String
});

export default mongoose.model('Comment', commentSchema);
