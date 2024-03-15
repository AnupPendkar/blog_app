import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import blankUser from '@assets/blank_user.svg';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { constructDateTime, isPropEmpty } from '@shared/utilfunctions';
import { IComment } from '@models/post_model';
import { ReqMethodEnum } from '@models/common';
import { useAppSelector } from '@redux/store';

interface ICommentProp {
  data: IComment;
  onCommentSubmit: (comment: string, reqMethod: ReqMethodEnum, id: number, isReply?: boolean) => void;
  onCommentLike: (id: number, addLike: boolean, isReply?: boolean) => void;
  parentId?: number;
}

const Comment = ({ data, onCommentSubmit, onCommentLike, parentId }: ICommentProp) => {
  const [reply, setReply] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showReply, setShowReply] = React.useState(false);
  const [isEditClk, setEditClk] = React.useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const { parsedUserInfo } = useAppSelector((state) => state?.user);

  function handleReplyClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMoreClick(event: React.MouseEvent<HTMLButtonElement>) {
    setMoreAnchorEl(event.currentTarget);
  }

  function handleEditSubmit() {
    if (isPropEmpty(parentId)) {
      onCommentSubmit(reply, ReqMethodEnum.PUT, data?.id);
    } else {
      onCommentSubmit(reply, ReqMethodEnum.PUT, data?.id, true);
    }
  }

  function handleReplySubmit() {
    onCommentSubmit(reply, ReqMethodEnum.POST, data?.id, true);
    setShowReply(true);
  }

  function onSubmitCommentClk() {
    isEditClk ? handleEditSubmit() : handleReplySubmit();

    setReply('');
    setAnchorEl(null);
    setEditClk(false);
  }

  function handleLikeClk(addLike: boolean) {
    if (isPropEmpty(parentId)) {
      onCommentLike(data?.id, addLike);
    } else {
      onCommentLike(data?.id, addLike, true);
    }
  }

  function handleEditClk(event: React.MouseEvent<any>) {
    setEditClk(true);
    setAnchorEl(event.currentTarget);
    setMoreAnchorEl(null);
    setReply(data?.comment);
  }

  function isCommentAuthor(data: IComment) {
    return data?.userId === parsedUserInfo?.id;
  }

  function handleDeleteClk() {
    if (isPropEmpty(parentId)) {
      onCommentSubmit('', ReqMethodEnum.DELETE, data?.id);
    } else {
      onCommentSubmit('', ReqMethodEnum.DELETE, data?.id, true);
    }
    setMoreAnchorEl(null);
  }

  function isUserAlreadyLiked(data: IComment) {
    return data?.likes?.some((val) => val?.userId === parsedUserInfo?.id);
  }

  return (
    <>
      <div className="comment relative flex flex-col mb-5">
        <div className="flex items-center user-details mb-4">
          <img className="w-12 h-12 rounded-full mr-3" src={!isPropEmpty(data.profileImg) ? data.profileImg : blankUser} alt="" />

          <div className="flex flex-col">
            <span className="fsr-14 inter mb-1" style={{ color: '#767882' }}>
              {data.username}
            </span>
            <span className="fsr-12 inter" style={{ color: '#767882' }}>
              Published &nbsp;{constructDateTime(data.createdAt)}
            </span>
          </div>
        </div>
        <div className="absolute -top-1 right-1 cursor-pointer">
          {isCommentAuthor(data) && (
            <IconButton onClick={handleMoreClick} className="mr-2" aria-label="More">
              <MoreVertIcon className="w-full h-full" />
            </IconButton>
          )}
        </div>
        <span className="fsr-16 inter">{data.comment}</span>

        <div className="flex items-center">
          {isUserAlreadyLiked(data) ? (
            <IconButton
              onClick={() => {
                handleLikeClk(false);
              }}
              aria-label="More"
            >
              <FavoriteIcon style={{ color: 'tomato', width: 20, height: 20 }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                handleLikeClk(true);
              }}
              aria-label="More"
            >
              <FavoriteBorderOutlinedIcon style={{ width: 20, height: 20 }} />
            </IconButton>
          )}

          <span className="fsr-14 mr-4">{data?.likes?.length}</span>

          {!parentId && (
            <IconButton onClick={handleReplyClick} className="mr-2" aria-label="reply">
              <ChatIcon style={{ color: '#767882', width: 20, height: 20 }} />
            </IconButton>
          )}

          {data?.replies?.length > 0 && (
            <IconButton
              onClick={() => {
                setShowReply((prev) => !prev);
              }}
            >
              <KeyboardArrowDownIcon
                style={{ color: '#767882', width: 20, height: 20, transition: 'transform 0.2s linear', transform: `rotate(${showReply ? '180deg' : '0deg'})` }}
              />
            </IconButton>
          )}
        </div>
      </div>

      <div className="lg:pl-8 md:pl-6 sm:pl-4" style={{ borderLeft: '2px solid grey' }}>
        {showReply &&
          data?.replies?.map((rec) => <Comment key={rec?.id} data={rec} parentId={rec?.parentCommentId} onCommentSubmit={onCommentSubmit} onCommentLike={onCommentLike} />)}
      </div>

      <Menu id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
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
            <Button disabled={reply === ''} onClick={onSubmitCommentClk} color="success" variant="contained" style={{ padding: '2px 5px' }}>
              Submit
            </Button>
          </div>
        </div>
      </Menu>

      <Menu id="menu-appbar" anchorEl={moreAnchorEl} keepMounted open={Boolean(moreAnchorEl)} onClose={() => setMoreAnchorEl(null)}>
        <MenuItem onClick={handleEditClk}>
          <span className="fsr-14 font-isb ml-3">Edit</span>
        </MenuItem>
        <MenuItem onClick={handleDeleteClk}>
          <span className="fsr-14 font-isb ml-3">Delete</span>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Comment;
