import React, { useState } from 'react';
import useAuthMethods from '@hooks/useAuthMethods';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import UserService from '@services/userService';
import CloseIcon from '@mui/icons-material/Close';
import { isPropEmpty } from '@shared/utilfunctions';
import userImg from '@assets/userImg.png';

const Register = ({ open, setOpen, openLoginForm }) => {
  const { setUserLoginData } = useAuthMethods();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const userService = UserService();

  const schema = z.object({
    username: z.string().min(2).max(20),
    name: z.string().min(2).max(20),
    password: z.string().min(1).max(20),
    profileImg: z.string().default(''),
    mobileNo: z.number().min(10).max(10),
    email: z.number(),
  });
  type LoginFormSchema = z.infer<typeof schema>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(schema),
  });

  async function onLoginClick(credentials: LoginFormSchema) {
    const res = await userService.submitLoginDetails({
      username: credentials.username,
      password: credentials.password,
      client_ip: 'http://172.16.120.20:3200',
    });

    setUserLoginData(res?.access, res?.refresh);
  }

  const fileInputRef = React.useRef(null);
  const [thumbImg, setThumbImg] = React.useState(null);
  const { uploadImg } = UserService();

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const img = await uploadImg(file);

    setValue('profileImg', img.path);
    setThumbImg(img.path);
  }

  const handleImgClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={open} color="primary">
      <DialogContent color="secondary">
        <form className="login-form min-w-[350px]" onSubmit={handleSubmit(onLoginClick)}>
          <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
            Please register
          </span>

          <div className="w-full flex flex-col items-center mt-3">
            <div className="w-14 h-14">
              {isPropEmpty(thumbImg) ? (
                <>
                  <img className="w-full h-full cursor-pointer" src={userImg} onClick={handleImgClick} alt="" style={{ borderRadius: '50%' }} />
                </>
              ) : (
                <img className="w-full h-full cursor-pointer" src={thumbImg} onClick={handleImgClick} alt="" />
              )}

              <input className="w-full h-full" ref={fileInputRef} onChange={handleFileInputChange} type="file" hidden />
            </div>
            <span className="fsr-14 inter">Profile Img</span>
          </div>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label" htmlFor="name">
              Name:
            </label>

            <TextField
              {...register('name')}
              id="name"
              type="text"
              size="small"
              color="success"
              InputProps={{
                sx: {
                  borderRadius: '5px !important',
                  backgroundColor: 'white',
                  color: '#191919',
                },
              }}
            ></TextField>
          </div>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label" htmlFor="mobileNo">
              Mobile No:
            </label>

            <TextField
              {...register('mobileNo')}
              id="mobileNo"
              type="text"
              size="small"
              color="success"
              InputProps={{
                sx: {
                  borderRadius: '5px !important',
                  backgroundColor: 'white',
                  color: '#191919',
                },
              }}
            ></TextField>
          </div>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label" htmlFor="email">
              Email:
            </label>

            <TextField
              {...register('email')}
              id="email"
              type="email"
              size="small"
              color="success"
              InputProps={{
                sx: {
                  borderRadius: '5px !important',
                  backgroundColor: 'white',
                  color: '#191919',
                },
              }}
            ></TextField>
          </div>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label" htmlFor="username">
              Username:
            </label>

            <TextField
              {...register('username')}
              id="username"
              type="text"
              size="small"
              color="success"
              InputProps={{
                sx: {
                  borderRadius: '5px !important',
                  backgroundColor: 'white',
                  color: '#191919',
                },
              }}
            ></TextField>
          </div>

          <div className="field mb-1 relative flex justify-between items-center">
            <label className="field-label" htmlFor="password">
              Password:
            </label>
            <TextField
              {...register('password')}
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              size="small"
              InputProps={{
                sx: {
                  borderRadius: '5px !important',
                  backgroundColor: 'white',
                  color: '#191919',
                },
              }}
            ></TextField>
            <IconButton onClick={() => setPasswordVisibility((state) => !state)} className="right-1" sx={{ position: 'absolute', color: '#191919' }}>
              {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>

          <DialogActions>
            <div className="flex flex-col justify-end mt-3 mb-5">
              <Button disabled={!(isDirty && isValid)} color="success" type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </DialogActions>
        </form>
        <div onClick={() => setOpen(false)} className="w-4 h-4 absolute top-5 right-8 cursor-pointer">
          <CloseIcon />
        </div>

        <span onClick={() => openLoginForm(true)} className="fsr-14 inter float-end cursor-pointer" style={{ color: '#266FDC' }}>
          Back to login
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
