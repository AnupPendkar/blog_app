export interface IPublishPost {
  title: string;
  content: string;
  categories?: Array<number>;
}

export interface IPostDetails {
  id: number;
  createdAt: string;
  thumbnailImg: string;
  categories: Array<any>;
  title: string;
  desc: string;
  content: string;
}

export interface IPostAuthor {
  id: number;
  fullName: string;
  followers: IFollower[];
  profileImg: string;
  username: string;
  email: string;
}

export interface ISinglePost {
  id: number;
  author: IPostAuthor;
  createdAt: string;
  updatedAt: string;
  title: string;
  desc: string;
  thumbnailImg: string;
  content: string;
  authorId: number;
  categories: [];
  comments: IComment[];
  likes: ILike[];
}

export interface IFollower {
  authorId: number;
  follower: number;
}

export interface IComment {
  id: number;
  createdAt: string;
  email: string;
  profileImg: string;
  username: string;
  comment: string;
  replies: Exclude<IComment, 'replies'>[];
  postId: number;
  userId: number;
}

export interface ILike {
  id: number;
  postId: number;
  userId: number;
}

export enum PostMethodEnum {
  POST_LIKE = 1,
  COMMENT = 2,
  COMMENT_LIKE = 3,
  REPLY = 4,
  REPLY_LIKE = 5,
}
