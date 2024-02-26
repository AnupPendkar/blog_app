import React from 'react';

export interface ICommentDetails {
  userImg: string;
  username: string;
  timestamp: string;
  comment: string;
}

const Comment = (props: ICommentDetails) => {
  function constructDateTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDay()}`;
  }

  return (
    <div className="comment mb-6">
      <div className="flex items-center user-details mb-4">
        <img className="w-12 h-12 rounded-full mr-3" src={props.userImg} alt="" />

        <div className="flex flex-col">
          <span className="fsr-14 inter mb-1" style={{ color: '#767882' }}>
            {props.username}
          </span>
          <span className="fsr-12 inter" style={{ color: '#767882' }}>
            {constructDateTime(props.timestamp)}
          </span>
        </div>
      </div>
      <span className="fsr-16 inter">{props.comment}</span>
    </div>
  );
};

export default Comment;
