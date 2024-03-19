import { IFollower, IPostDetails, ISinglePost } from './post_model';

export interface ILoginParams {
  username: string;
  password: string;
  client_ip: string;
}

export interface ILoginRes {
  access: string;
  refresh: string;
}

export interface ICollectionsAPI {
  id: number;
  name: string;
  total: number;
  post: IPostDetails[];
}

export interface IUserInfoAPI {
  email: string;
  id: number;
  fullName: string;
  profileImg: string;
  username: string;
  password: string;
  phoneNo: string;
}

export interface IUserDetailsAPI {
  fullName: string;
  about: IUserAboutAPI;
  collections: ICollectionsAPI[];
  profileImg: string;
  username: string;
  email: string;
  followers: {
    authorId: number;
    followId: number;
    follower: {
      id: number;
      userId: number;
    };
  }[];
  posts: Exclude<ISinglePost, 'comments' | 'likes'>[];
}

export interface IUserAboutAPI {
  desc: string;
  id: number;
  profession: string;
  userId: number;
}
