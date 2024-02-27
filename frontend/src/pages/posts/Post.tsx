import React from 'react';
import { PostViewEnum } from '@models/homepage';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';
import { IPostDetails } from '@models/post_model';

const Post = ({ postDetails, postView }: { postDetails: IPostDetails; postView: PostViewEnum }) => {
  function constructDateTime(timestamp: number) {
    const date = new Date(timestamp);
    return `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDay()}`;
  }

  const navigate = useNavigate();

  function showFullPost(id: number) {
    navigate(`${AppRoutesEnum.SINGLE_POST}/${id}`);
  }

  return (
    <>
      {[PostViewEnum.PARTIAL, PostViewEnum.COMPLETE]?.indexOf(postView) >= 0 ? (
        <div className="post flex items-center gap-7 mb-12 cursor-pointer" onClick={() => showFullPost(postDetails?.id)}>
          <div className="basis-1/2">
            <img className="w-full max-h-[300px]" src={postDetails?.thumbnailImg} alt="" />
          </div>
          <div className="flex flex-col basis-1/2">
            <div className="mb-6">
              <span className="fsr-14 mr-3 font-rm" style={{ color: '#494E59' }}>
                {constructDateTime(postDetails?.createdAt)}
              </span>

              {postDetails?.categories?.map((cat) => (
                <span className="fsr-14  font-rm" style={{ color: '#652034', textTransform: 'uppercase' }}>
                  {cat}
                </span>
              ))}
            </div>

            <span className="fsr-25 font-ib mb-4">{postDetails?.title}</span>
            <span className="fsr-16 inter mb-7" style={{ color: '#9E9D9E' }}>
              {postDetails?.desc}
            </span>

            <div>
              <span className="fsr-14 inter underline decoration-2 underline-offset-4 cursor-pointer" style={{ textDecorationColor: '#652034' }}>
                Read More
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center mb-2 cursor-pointer" onClick={() => showFullPost(postDetails?.id)}>
          {postView === PostViewEnum.TITLE_WITH_IMG && <img className="w-11 h-11 rounded-full mr-4" src={postDetails?.thumbnailImg} alt="" />}
          <div className="flex flex-col">
            <div className="w-fit rounded-lg" style={{ backgroundColor: '#652034', padding: '0 10px' }}>
              {postDetails?.categories?.map((cat) => (
                <span className="fsr-10 font-rm" style={{ color: '#ffffff' }}>
                  {cat}
                </span>
              ))}
            </div>
            <span className="fsr-16 font-montm mt-2 mb-1">{postDetails?.title}</span>
            <div className="mb-6">
              <span className="fsr-12 mr-3 font-rm">Joseph Oven</span>
              <span className="fsr-12 font-rm" style={{ color: '#494E59' }}>
                {constructDateTime(postDetails?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;