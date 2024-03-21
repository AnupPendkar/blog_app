import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import React from 'react';
import Post from './Post';

interface IPostsProp {
  data: IPostDetails[];
  viewMethod: PostViewEnum;
}

const Posts = ({ data, viewMethod }: IPostsProp) => {
  return (
    <>
      {viewMethod === PostViewEnum.PARTIAL && <span className="post__title fsr-25 font-ib">Recent Posts</span>}

      {viewMethod === PostViewEnum.TITLE_ONLY && (
        <div className="flex flex-col">
          <span className="post__subtitle fsr-16 inter" style={{ color: '#5C5D64' }}>
            What's hot
          </span>
          <span className="post__title fsr-25 font-ib">Most Popular</span>
        </div>
      )}

      {viewMethod === PostViewEnum.TITLE_WITH_IMG && (
        <div className="flex flex-col">
          <span className="post__subtitle fsr-16 inter" style={{ color: '#5C5D64' }}>
            Chosen by the editor
          </span>
          <span className="post__title fsr-25 font-ib">Editors Pick</span>
        </div>
      )}

      <div className="posts mt-5 mb-10">
        {data?.map((postInfo, idx) => (
          <Post key={idx} postDetails={postInfo} postView={viewMethod} />
        ))}
      </div>
    </>
  );
};

export default Posts;
