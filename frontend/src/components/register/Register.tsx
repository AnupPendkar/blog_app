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
import { RegisterFormCloseType } from '@components/login/Login';
import { AuthStateEnum } from '@models/user_service_model';

interface IRegisterProp {
  setOpen: (flag: boolean) => {};
  setAuthState: (state: AuthStateEnum) => void;
  setToastrMsg: (msg: string) => void;
}

const Register = ({ setOpen, setAuthState, setToastrMsg }: IRegisterProp) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { registerUser } = UserService();

  const schema = z
    .object({
      // username: z.string().min(2, { message: 'Username is too short' }).max(20, { message: 'Username is too long' }),
      email: z.string().email('Enter valid email'),
      name: z.string().min(2, { message: 'name is too short' }).max(20, { message: 'Username is too long' }),
      password: z.string().min(1, { message: 'password is too short' }).max(20, { message: 'Username is too long' }),
      confirmPassword: z.string().min(1, { message: 'password is too short' }).max(20, { message: 'Username is too long' }),
      // profileImg: z.string().url('Invalid Url'),
      // mobileNo: z.string().min(10, { message: 'Enter valid mobile no' }).max(10, { message: 'Enter valid mobile no' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  type RegisterFormSchema = z.infer<typeof schema>;

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(schema),
  });

  async function onLoginClick(data) {
    await registerUser(data);
    setToastrMsg('Registeration successfull! Login to continue.');
    setAuthState(AuthStateEnum.LOGIN);
    // onCloseRegisterForm(RegisterFormCloseType.REGISTER_SUCCESS);
  }

  const fileInputRef = React.useRef(null);
  const [thumbImg, setThumbImg] = React.useState(null);
  const { uploadImg } = UserService();

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];
    const img = await uploadImg(file);

    // setValue('profileImg', img.path);
    setThumbImg(img.path);
  }

  const handleImgClick = () => {
    fileInputRef.current.click();
  };

  function handleCloseClk() {
    setAuthState(AuthStateEnum.LOGIN);
    setOpen(false);
  }

  return (
    <Dialog open={true} color="primary">
      <DialogContent color="secondary">
        <form className="login-form min-w-[250px]" onSubmit={handleSubmit(onLoginClick)}>
          <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
            Please register
          </span>

          <div className="w-full flex flex-col items-center mt-3">
            <div className="w-14 h-14 mb-2">
              {isPropEmpty(thumbImg) ? (
                <>
                  <img className="w-full h-full cursor-pointer" src={userImg} onClick={handleImgClick} alt="" style={{ borderRadius: '50%' }} />
                </>
              ) : (
                <img className="w-full h-full cursor-pointer" src={thumbImg} onClick={handleImgClick} alt="" style={{ borderRadius: '50%' }} />
              )}

              <input className="w-full h-full" ref={fileInputRef} onChange={handleFileInputChange} type="file" hidden />
            </div>
            <span className="fsr-16 inter">Profile Img</span>
          </div>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label basis-1/3" htmlFor="name">
              Name:
            </label>

            <div className="flex flex-col relative basis-2/3">
              <TextField
                {...register('name')}
                id="name"
                name="name"
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
              {errors.name && (
                <span className="absolute fsr-12 -bottom-4" style={{ color: 'tomato' }}>
                  *{errors.name.message}
                </span>
              )}
            </div>
          </div>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label basis-1/3" htmlFor="email">
              Email:
            </label>

            <div className="flex flex-col relative basis-2/3">
              <TextField
                {...register('email')}
                id="email"
                name="email"
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
              {errors.email && (
                <span className="absolute fsr-12 -bottom-4" style={{ color: 'tomato' }}>
                  *{errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label" htmlFor="username">
              Username:
            </label>

            <div className="flex flex-col relative">
              <TextField
                {...register('username')}
                id="username"
                name="username"
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
              {errors.username && (
                <span className="absolute fsr-12 -bottom-4" style={{ color: 'tomato' }}>
                  *{errors.username.message}
                </span>
              )}
            </div>
          </div> */}

          <div className="field mb-1 relative flex justify-between items-center">
            <label className="field-label basis-1/3" htmlFor="password">
              Password:
            </label>

            <div className="flex flex-col relative basis-2/3">
              <TextField
                {...register('password')}
                id="password"
                name="password"
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
              {errors.password && (
                <span className="absolute fsr-12 -bottom-4" style={{ color: 'tomato' }}>
                  *{errors.password.message}
                </span>
              )}
            </div>
            <IconButton onClick={() => setPasswordVisibility((state) => !state)} className="right-1" sx={{ position: 'absolute', color: '#191919' }}>
              {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>

          <div className="field mt-5 mb-4 relative flex justify-between items-center">
            <label className="field-label basis-1/3" htmlFor="password">
              Confirm password:
            </label>

            <div className="flex flex-col relative basis-2/3">
              <TextField
                {...register('confirmPassword')}
                id="confirmPassword"
                name="confirmPassword"
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
              {errors.confirmPassword && (
                <span className="absolute fsr-12 -bottom-4" style={{ color: 'tomato' }}>
                  *{errors.confirmPassword.message}
                </span>
              )}
            </div>
            <IconButton onClick={() => setPasswordVisibility((state) => !state)} className="right-1" sx={{ position: 'absolute', color: '#191919' }}>
              {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>

          <DialogActions>
            <div className="flex flex-col justify-end mt-3 mb-5">
              <Button color="success" type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </DialogActions>
        </form>
        <div onClick={handleCloseClk} className="w-4 h-4 absolute top-5 right-8 cursor-pointer">
          <CloseIcon />
        </div>

        <span onClick={() => setAuthState(AuthStateEnum.LOGIN)} className="fsr-14 inter float-end cursor-pointer" style={{ color: '#266FDC' }}>
          Back to login
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
