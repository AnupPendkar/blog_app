import { IComment } from '@models/post_model';
import { Button, Menu } from '@mui/material';
import React from 'react';

export interface ICommentDetails {
  userImg: string;
  username: string;
  timestamp: string;
  comment: string;
  commentId?: number;
  setComment?: (comment: string, parentId: number) => void;
}

const Comment = (props: ICommentDetails) => {
  const [reply, setReply] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function constructDateTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDay()}`;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  function onSubmitClk() {
    setReply('');
    props.setComment(reply, props.commentId);
    handleClose();
  }

  return (
    <>
      <div className="comment flex flex-col mb-6">
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
        {props?.setComment && (
          <Button onClick={handleClick} className="self-end" style={{ marginRight: 5, background: '#767882' }} color="success" variant="contained">
            Reply
          </Button>
        )}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <div className="flex flex-col items-end mt-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full outline-none border-none px-3 py-1 rounded-md min-h-20 max-h-25 resize-none"
            placeholder="What are your thoughts?"
          ></textarea>
          <div className="flex gap-3 mt-3">
            <Button onClick={() => setReply('')} color="cancel" variant="contained">
              Clear
            </Button>
            <Button onClick={onSubmitClk} color="success" variant="contained">
              Submit
            </Button>
          </div>
        </div>
      </Menu>
    </>
  );
};

export default Comment;
