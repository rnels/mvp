export type Comment = {
  _id: number,
  username: string,
  userId: string,
  text: string,
  likeCount: number,
  videoId: string,
  search: string
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export type GetCommentsParams = {
  search: string,
  likeCount: number
}
