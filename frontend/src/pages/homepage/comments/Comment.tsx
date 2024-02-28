import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Menu, MenuItem } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  function constructDateTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDay()}`;
  }

  const handleReplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleCloseReplayMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseMoreMenu = () => {
    setMoreAnchorEl(null);
  };

  function onSubmitClk() {
    setReply('');
    props.setComment(reply, props.commentId);
    handleCloseReplayMenu();
  }

  // function onMore

  return (
    <>
      <div className="comment relative flex flex-col mb-6">
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
        <div className="absolute top-1 right-1 cursor-pointer">
          <span onClick={handleMoreClick}>
            <MoreVertIcon className=" w-full h-full" />
          </span>
        </div>
        <span className="fsr-16 inter">{props.comment}</span>
        {props?.setComment && (
          <Button onClick={handleReplyClick} className="self-end" style={{ marginRight: 8, background: '#767882', padding: '2px 5px' }} color="success" variant="contained">
            Reply
          </Button>
        )}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseReplayMenu}
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
            <Button onClick={() => setReply('')} color="cancel" variant="contained" style={{ padding: '2px 5px' }}>
              Clear
            </Button>
            <Button onClick={onSubmitClk} color="success" variant="contained" style={{ padding: '2px 5px' }}>
              Submit
            </Button>
          </div>
        </div>
      </Menu>

      <Menu id="menu-appbar" anchorEl={moreAnchorEl} keepMounted open={Boolean(moreAnchorEl)} onClose={handleCloseMoreMenu}>
        <MenuItem onClick={() => {}}>
          <span className="fsr-14 font-isb ml-3">Edit</span>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <span className="fsr-14 font-isb ml-3">Delete</span>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Comment;
