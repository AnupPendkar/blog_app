import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import UserService from '@services/userService';
import { isPropEmpty } from '@shared/utilfunctions';
import postService from '@services/postService';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';

const PublishDialog = ({ title, content }) => {
  const [dialogVisibility, setDialogVisibility] = React.useState(true);
  const publishDialogForm = z.object({
    postDesc: z.string().min(2).max(20),
    thumbnailImg: z.string(),
  });

  type LoginFormSchema = z.infer<typeof publishDialogForm>;

  const { publishPost } = postService();
  const navigate = useNavigate();

  const { register, getValues, setValue, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(publishDialogForm),
  });

  function onCancelClick() {
    setDialogVisibility(false);
  }

  async function onConfirmClick() {
    const res = await publishPost(title, content, getValues()?.postDesc, getValues()?.thumbnailImg);

    setDialogVisibility(false);
    navigate(`${AppRoutesEnum.SINGLE_POST}/${res}`);
  }

  const fileInputRef = React.useRef(null);
  const [thumbImg, setThumbImg] = React.useState(null);
  const { uploadImg } = UserService();

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const img = await uploadImg(file);

    setValue('thumbnailImg', img.path);
    setThumbImg(img.path);
  }

  const handleImgClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={dialogVisibility}>
      <DialogTitle className="flex items-center">Publish</DialogTitle>
      <DialogContent color="secondary">
        <div className="flex items-center mb-6">
          <span className="fsr-16 font-im mr-4">Blog Desc: </span>
          <textarea className="py-1 px-3" onChange={(e) => setValue('postDesc', e.target.value)} name="" id="" cols={30} rows={3}></textarea>
        </div>

        <div className="flex items-center mb-6">
          <span className="fsr-16 font-im mr-4">Thumbnail Image: </span>
          <div className="w-11 h-11">
            {isPropEmpty(thumbImg) ? (
              <>
                <AddPhotoAlternateOutlinedIcon className="cursor-pointer" onClick={handleImgClick} style={{ width: '100%', height: '100%' }} />
              </>
            ) : (
              <img className="w-full h-full cursor-pointer" src={thumbImg} onClick={handleImgClick} alt="" />
            )}

            <input className="w-full h-full" ref={fileInputRef} onChange={handleFileInputChange} type="file" hidden />
          </div>
        </div>

        <DialogActions>
          <Button color="cancel" onClick={onCancelClick} variant="contained">
            Cancel
          </Button>
          <Button color="success" onClick={onConfirmClick} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
