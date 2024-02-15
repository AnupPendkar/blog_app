import React from 'react';
import Comment from './Comment';
import design from '@assets/design1.png';

const Comments = () => {
  return (
    <>
      <span className="fsr-25 font-ib">Comments</span>

      <div className="mt-6">
        <Comment
          userImg={design}
          username="Carlos Castillo"
          timestamp={12981923}
          comment="Wow, I never thought about approaching creativity from this angle before! This post has given me a fresh perspective and some really practical ideas to try out."
        />
        <Comment userImg={design} username="Carlos Castillo" timestamp={12981923} comment="Cant wait to start exploring this new tool." />
        <Comment userImg={design} username="Carlos Castillo" timestamp={12981923} comment="What an insightful read! The tips you shared are so doable and efficient." />
      </div>
    </>
  );
};

export default Comments;
