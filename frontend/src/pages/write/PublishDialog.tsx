import React from 'react';
import * as z from 'zod';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import UserService from '@services/userService';
import postService from '@services/postService';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CheckboxSelector from '@pages/shared-comp/CheckboxSelector';
import useCategories from '@hooks/useCategories';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isPropEmpty } from '@shared/utilfunctions';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';
import { ICategories } from '@models/post_model';

interface IPublishDialogProp {
  visibility: boolean;
  title: string;
  content: string;
  isVisible: (flag: boolean) => void;
}

const PublishDialog = ({ visibility, title, content, isVisible }: IPublishDialogProp) => {
  const fileInputRef = React.useRef(null);
  const [thumbImg, setThumbImg] = React.useState(null);
  const [selectedCat, setSelectedCat] = React.useState<number[]>([]);
  const [categories, setCategories] = React.useState<ICategories[]>([]);
  const { uploadImg } = UserService();
  const { getCategories } = useCategories();

  const publishDialogForm = z.object({
    postDesc: z.string().min(2).max(20),
    thumbnailImg: z.string(),
  });

  type LoginFormSchema = z.infer<typeof publishDialogForm>;

  const { publishPost } = postService();
  const navigate = useNavigate();

  const { getValues, setValue, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(publishDialogForm),
  });

  function onCancelClick() {
    isVisible(false);
  }

  async function getAllCategories() {
    const res = await getCategories();
    setCategories(res);
  }

  async function onConfirmClick() {
    const res = await publishPost(title, content, getValues()?.postDesc, getValues()?.thumbnailImg, selectedCat);

    isVisible(false);
    navigate(`${AppRoutesEnum.SINGLE_POST}/${res}`);
  }

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const img = await uploadImg(file);

    setValue('thumbnailImg', img.path);
    setThumbImg(img.path);
  }

  const handleImgClick = () => {
    fileInputRef.current.click();
  };

  function handleChange(event, value: ICategories[]) {
    setSelectedCat(value?.reduce((total, curr) => total.concat(curr?.id), []));
  }

  React.useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <Dialog open={visibility}>
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

        <div className="flex items-center mb-6">
          <span className="fsr-16 font-im mr-4">Tag categories: </span>
          <CheckboxSelector selectedCat={selectedCat} categories={categories} handleChange={handleChange} />
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
