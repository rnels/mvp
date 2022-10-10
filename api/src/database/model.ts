import CommentModel from './db';

// TODO: Works with partial match now, but want to explore this further
// to possibly have it partial match only whole words
export function getCommentsBySearchPartial(search: string, likeCount: number=0) {
  return CommentModel.find({search: { $regex: search }}).where('likeCount').gt(likeCount);
}

export function getCommentsBySearch(search: string, likeCount: number=0) {
  return CommentModel.find({search}).where('likeCount').gt(likeCount);
}

export function doesSearchExist(search: string) {
  return CommentModel.findOne({search});
}

// TODO: Update comments with a type
export function saveComments(comments) {
  let updatePromises = [];
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