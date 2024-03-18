export interface IPublishPost {
  title: string;
  content: string;
  categories?: Array<number>;
}

export interface IPostDetails {
  id: number;
  createdAt: string;
  thumbnailImg: string;
  categories: Array<ICategories>;
  title: string;
  desc: string;
  content: string;
}

export type PostPagination<T> = {
  count: number;
  posts: T;
};

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
  categories: ICategories[];
  comments: IComment[];
  likes: ILike[];
}

export interface ICategories {
  id: number;
  name: string;
  bgColor: string;
  img: string;
}

export interface IFollower {
  authorId: number;
  follower: number;
}

export interface IComment {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  profileImg: string;
  username: string;
  comment: string;
  expand: boolean;
  likes: {
    id: number;
    userId: number;
  }[];
  parentCommentId?: number;
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
