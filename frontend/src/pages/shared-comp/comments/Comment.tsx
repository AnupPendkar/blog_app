import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react';
import { constructDateTime } from '@shared/utilfunctions';

interface ICommentProp {
  userImg: string;
  username: string;
  timestamp: string;
  comment: string;
  commentId?: number;
  setComment?: (comment: string, parentId: number) => void;
}

const Comment = (props: ICommentProp) => {
  const [reply, setReply] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleReplyClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMoreClick(event: React.MouseEvent<HTMLButtonElement>) {
    setMoreAnchorEl(event.currentTarget);
  }

  function handleReply() {
    setReply('');
    props.setComment(reply, props.commentId);
    setAnchorEl(null);
  }

  function isUserAlreadyLiked() {
    return true;
  }

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
            <MoreVertIcon className="w-full h-full" />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="fsr-16 inter">{props.comment}</span>
          <div onClick={() => {}} className="cursor-pointer">
            {isUserAlreadyLiked() ? <FavoriteIcon style={{ color: 'tomato' }} /> : <FavoriteBorderOutlinedIcon />}
            <span className="fsr-14 ml-2">{3}</span>
          </div>
        </div>
        {props?.setComment && (
          <IconButton onClick={handleReplyClick} className="self-end mr-2" aria-label="reply">
            <ChatIcon className="w-2 h-2" style={{ color: '#767882' }} />
          </IconButton>
        )}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
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
            <Button onClick={handleReply} color="success" variant="contained" style={{ padding: '2px 5px' }}>
              Submit
            </Button>
          </div>
        </div>
      </Menu>

      <Menu id="menu-appbar" anchorEl={moreAnchorEl} keepMounted open={Boolean(moreAnchorEl)} onClose={() => setMoreAnchorEl(null)}>
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
