export interface IPublishPost {
  title: string;
  content: string;
  categories?: Array<number>;
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
  id: number;
  userId: number;
}

export interface IComment {
  id: number;
  comment: string;
  postId: number;
  userId: number;
}

export interface ILike {
  id: number;
  postId: number;
  userId: number;
}
