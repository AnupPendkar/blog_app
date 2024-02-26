import React from 'react';
import Comment from './Comment';
import design from '@assets/design1.png';
import { Button, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import postService from '@services/postService';
import { IComment } from '@models/post_model';

const Comments = ({ data, open, onSubmit, setOpen }: { data: IComment[]; open: boolean; onSubmit: (comment: string) => void; setOpen: (value: boolean) => void }) => {
  const [comment, setComment] = React.useState('');

  async function onCommentSubmit() {
    onSubmit(comment);
  }

  return (
    <>
      <Drawer
        variant="persistent"
        sx={{
          width: '30%',
          flexShrink: 0,
          background: '#191919',
          '& .MuiDrawer-paper': {
            width: '30%',
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
            <div className="w-3 cursor-pointer" onClick={() => setOpen(false)}>
              <CloseIcon className="w-full" />
            </div>
          </div>
          <div className="mt-3 overflow-auto h-full">
            {data?.map((rec) => (
              <Comment userImg={rec?.profileImg} username={rec?.username} timestamp={rec?.createdAt} comment={rec?.comment} />
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
              <Button onClick={onCommentSubmit} color="success" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Comments;
