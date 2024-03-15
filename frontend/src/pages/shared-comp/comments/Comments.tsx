import React from 'react';
import Comment from './Comment';
import CloseIcon from '@mui/icons-material/Close';
import postService from '@services/postService';
import Login from '@components/login/Login';
import { Button, Drawer } from '@mui/material';
import { ISinglePost, PostMethodEnum } from '@models/post_model';
import { ReqMethodEnum } from '@models/common';
import { useAppSelector } from '@redux/store';

interface ICommentsProp {
  data: ISinglePost;
  open: boolean;
  closeComments: (value: boolean) => void;
  shouldFetchAPI: () => void;
}

const Comments = ({ data, open, closeComments, shouldFetchAPI }: ICommentsProp) => {
  const [comment, setComment] = React.useState('');
  const [openLogin, setOpenLogin] = React.useState(false);
  const { onPostAction } = postService();
  const { userLoggedIn } = useAppSelector((state) => state.user);

  async function submitComment() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }
    await onCommentSubmit(comment, ReqMethodEnum.POST, data?.id);
    setComment('');
  }

  async function onCommentSubmit(comment: string, reqMethod: ReqMethodEnum, id: number, isReply = false) {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }
    switch (reqMethod) {
      case ReqMethodEnum.POST: // Insert comment
        if (!isReply) {
          await onPostAction({ postId: data?.id, comment }, PostMethodEnum.COMMENT, 'post');
        } else {
          await onPostAction({ parentCommentId: id, comment }, PostMethodEnum.REPLY, 'post');
        }
        break;

      case ReqMethodEnum.PUT: // Update comment
        if (!isReply) {
          await onPostAction({ commentId: id, comment }, PostMethodEnum.COMMENT, 'put');
        } else {
          await onPostAction({ replyId: id, reply: comment }, PostMethodEnum.REPLY, 'put');
        }
        break;

      case ReqMethodEnum.DELETE: // Delete comment
        if (!isReply) {
          await onPostAction({ commentId: id, comment }, PostMethodEnum.COMMENT, 'delete');
        } else {
          await onPostAction({ replyId: id }, PostMethodEnum.REPLY, 'delete');
        }
        break;
    }
    shouldFetchAPI();
  }

  async function onCommentLike(id: number, addLike: boolean, isReply = false) {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }
    if (!isReply) {
      await onPostAction({ commentId: id }, PostMethodEnum.COMMENT_LIKE, addLike ? 'post' : 'put');
    } else {
      await onPostAction({ replyId: id }, PostMethodEnum.REPLY_LIKE, addLike ? 'post' : 'put');
    }
    shouldFetchAPI();
  }

  return (
    <>
      <Drawer
        variant="persistent"
        sx={{
          width: '500px',
          flexShrink: 0,
          background: '#191919',
          opacity: '0.9',
          '& .MuiDrawer-paper': {
            width: '500px',
            mt: '64px',
            boxSizing: 'border-box',
          },
        }}
        anchor="right"
        ModalProps={{
          keepMounted: true,
        }}
        open={open}
      >
        <div className="px-8 py-2 flex flex-col" style={{ height: 'calc(100% - 64px)' }}>
          <div className="flex justify-between">
            <span className="fsr-22 font-isb">Comments</span>
            <div className="w-3 cursor-pointer" onClick={() => closeComments(false)}>
              <CloseIcon className="w-full" />
            </div>
          </div>
          <div className="mt-3 overflow-auto h-full">
            {data?.comments?.map((rec, idx) => (
              <div key={idx + ' comment'}>
                <Comment data={rec} onCommentSubmit={onCommentSubmit} onCommentLike={onCommentLike} />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end mt-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full outline-none border-none px-3 py-1 rounded-md min-h-20 max-h-25 resize-none"
              placeholder="What are your thoughts?"
            ></textarea>
            <div className="flex gap-3 mt-3">
              <Button onClick={() => setComment('')} color="cancel" variant="contained">
                Clear
              </Button>
              <Button disabled={comment === ''} onClick={() => submitComment()} color="success" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      <Login open={openLogin} setOpen={setOpenLogin} />
    </>
  );
};

export default Comments;
