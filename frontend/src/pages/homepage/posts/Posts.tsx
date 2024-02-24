import React from 'react';
import Post from './Post';
import design from '@assets/design2.png';
import { PostViewEnum } from '@models/homepage';

export interface IPostDetails {
  timestamp: number;
  img: string;
  catName: string;
  title: string;
  para: string;
}

const Posts = ({ postView }: { postView: PostViewEnum }) => {
  const postInfo: IPostDetails = {
    img: design,
    timestamp: 12981923,
    catName: 'Coding',
    title: 'Easiest way for React State Management. A journey through',
    para: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium, ducimus! sit amet consectetur adipisicing elit.',
  };

  return (
    <>
      {postView === PostViewEnum.PARTIAL && <span className="fsr-25 font-ib">Recent Posts</span>}

      {postView === PostViewEnum.TITLE_ONLY && (
        <div className="flex flex-col">
          <span className="fsr-16 inter" style={{ color: '#5C5D64' }}>
            What's hot
          </span>
          <span className="fsr-25 font-ib">Most Popular</span>
        </div>
      )}

      {postView === PostViewEnum.TITLE_WITH_IMG && (
        <div className="flex flex-col">
          <span className="fsr-16 inter" style={{ color: '#5C5D64' }}>
            Chosen by the editor
          </span>
          <span className="fsr-25 font-ib">Editors Pick</span>
        </div>
      )}

      <div className="posts mt-5 mb-10">
        <Post postDetails={postInfo} postView={postView} />
        <Post postDetails={postInfo} postView={postView} />
        <Post postDetails={postInfo} postView={postView} />
      </div>
    </>
  );
};

export default Posts;
