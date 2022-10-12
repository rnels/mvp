export interface IComment {
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
