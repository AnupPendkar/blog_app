import React from 'react';
import { IPostDetails } from './Posts';
import { PostViewEnum } from '@models/homepage';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';

const Post = ({ postDetails, postView }: { postDetails: IPostDetails; postView: PostViewEnum }) => {
  function constructDateTime(timestamp: number) {
    const date = new Date(timestamp);
    return `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDay()}`;
  }

  const navigate = useNavigate();

  return (
    <>
      {[PostViewEnum.PARTIAL, PostViewEnum.COMPLETE]?.indexOf(postView) >= 0 ? (
        <div className="post flex items-center gap-7 mb-12">
          <div className="basis-1/2">
            <img className="w-full" src={postDetails?.img} alt="" />
          </div>
          <div className="flex flex-col basis-1/2">
            <div className="mb-6">
              <span className="fsr-14 mr-3 font-rm" style={{ color: '#494E59' }}>
                {constructDateTime(postDetails?.timestamp)}
              </span>
              <span className="fsr-14  font-rm" style={{ color: '#652034', textTransform: 'uppercase' }}>
                {postDetails?.catName}
              </span>
            </div>

            <span className="fsr-25 font-ib mb-4">{postDetails?.title}</span>
            <span className="fsr-16 inter mb-7" style={{ color: '#9E9D9E' }}>
              {postDetails?.para}
            </span>

            <div>
              <span
                onClick={() => navigate(AppRoutesEnum.SINGLE_POST)}
                className="fsr-14 inter underline decoration-2 underline-offset-4 cursor-pointer"
                style={{ textDecorationColor: '#652034' }}
              >
                Read More
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center mb-2">
          {postView === PostViewEnum.TITLE_WITH_IMG && <img className="w-11 h-11 rounded-full mr-4" src={postDetails?.img} alt="" />}
          <div className="flex flex-col">
            <div className="w-fit rounded-lg" style={{ backgroundColor: '#652034', padding: '0 10px' }}>
              <span className="fsr-10 font-rm" style={{ color: '#ffffff' }}>
                {postDetails?.catName}
              </span>
            </div>
            <span onClick={() => navigate(`${AppRoutesEnum.SINGLE_POST}/1`)} className="fsr-16 font-montm mt-2 mb-1 cursor-pointer">
              {postDetails?.title}
            </span>
            <div className="mb-6">
              <span className="fsr-12 mr-3 font-rm">Joseph Oven</span>
              <span className="fsr-12 font-rm" style={{ color: '#494E59' }}>
                {constructDateTime(postDetails?.timestamp)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
