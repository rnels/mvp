import { Schema, model } from 'mongoose';
import './db';
import { Comment } from '../types';

const commentSchema = new Schema<Comment>({
  _id: String,
  username: String,
  userId: String,
  text: String,
  likeCount: Number,
  videoId: String,
  search: String
});

const CommentModel = model<Comment>('Comment', commentSchema);

// TODO: Works with partial match now, but want to explore this further
// to possibly have it partial match only whole words
export function getCommentsBySearchPartial(search: string, likeCount=-1) {
  return CommentModel.find({search: { $regex: search }}).where('likeCount').gt(likeCount);
}

export function getCommentsBySearch(search: string, likeCount=-1) {
  return CommentModel.find({search}).where('likeCount').gt(likeCount);
}

export function doesSearchExist(search: string) {
  return CommentModel.findOne({search});
}

export function saveComments(comments: Comment[]) {
  let updatePromises: any[] = [];
  for (let comment of comments) {
    updatePromises.push(
      CommentModel.updateOne(
        {_id: comment._id},
        comment,
        {upsert: true}
      )
    );
  }
  return Promise.all(updatePromises);
}

export function getAllSearches() {
  return CommentModel.distinct('search');
}
