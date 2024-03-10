import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { IUserDetailsAPI } from '@models/user_service_model';
import UserService from '@services/userService';
import blankUser from '@assets/blank_user.svg';
import { isPropEmpty } from '@shared/utilfunctions';

interface IEditProfileDialogProp {
  visibility: boolean;
  userData: IUserDetailsAPI;
  onClose: (type: string) => void;
}

const EditProfileDialog = ({ userData, visibility, onClose }: IEditProfileDialogProp) => {
  const [updatedProfileImg, setUpdatedProfileImg] = React.useState('');
  const [updatedUsername, setUpdatedUsername] = React.useState('');
  const [updatedName, setUpdatedName] = React.useState('');
  const fileInputRef = React.useRef(null);
  const { updateUserProfile, uploadImg } = UserService();

  async function onSaveBtnClk() {
    await updateUserProfile({ profileImg: updatedProfileImg, name: updatedName, username: updatedUsername });
    onClose('update');
  }

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const img = await uploadImg(file);

    setUpdatedProfileImg(img.path);
  }

  const handleImgClick = () => {
    fileInputRef.current.click();
  };

  React.useEffect(() => {
    setUpdatedName(userData?.fullName);
    setUpdatedProfileImg(userData?.profileImg);
    setUpdatedUsername(userData?.username);
  }, [userData]);

  return (
    <Dialog open={visibility}>
      <DialogContent sx={{ minWidth: '400px' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="fsr-19 font-isb">Profile Information</span>
          <IconButton onClick={() => onClose('close')}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </IconButton>
        </div>
        <div className="field flex flex-col gap-3">
          <span className="fsr-15 inter">Photo</span>
          <div className="flex">
            <img className="mr-8" src={updatedProfileImg ?? blankUser} style={{ borderRadius: '50%', width: '55px', height: '55px' }} alt="" />
            {isPropEmpty(updatedProfileImg) ? (
              <Button color="success" variant="text" onClick={handleImgClick}>
                Add Profile Img
              </Button>
            ) : (
              <>
                <Button color="success" variant="text" onClick={handleImgClick}>
                  Update
                </Button>

                <Button onClick={() => setUpdatedProfileImg('')} color="error" variant="text">
                  Remove
                </Button>
              </>
            )}
            <input className="w-full h-full" ref={fileInputRef} onChange={handleFileInputChange} type="file" hidden />
          </div>
        </div>
        <div className="field flex flex-col mt-6 gap-2">
          <span className="fsr-15 inter">Username</span>
          <input value={updatedUsername} onChange={(e) => setUpdatedUsername(e.target.value)} className="fsr-16 py-2 px-5 outline-none rounded-md" />
        </div>
        <div className="field flex flex-col mt-6 gap-2">
          <span className="fsr-15 inter">Name</span>
          <input value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="fsr-16 py-2 px-5 outline-none rounded-md" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={() => onClose('close')} className="float-right" variant="contained" color="cancel">
            Close
          </Button>
          <Button onClick={onSaveBtnClk} disabled={updatedName === '' || updatedUsername === ''} className="float-right" variant="contained" color="success">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
