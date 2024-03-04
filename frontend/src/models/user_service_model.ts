import { IFollower, ISinglePost } from './post_model';

export interface ILoginParams {
  username: string;
  password: string;
  client_ip: string;
}

export interface ILoginRes {
  access: string;
  refresh: string;
}

export interface IUserDetailsAPI {
  fullName: string;
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
