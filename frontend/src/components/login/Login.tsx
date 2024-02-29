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
import Register from '@components/register/Register';
import { MessageIconTypeEnum } from '@models/common';
import Toastr from '@components/toastr/Toastr';

export enum RegisterFormCloseType {
  REGISTER_SUCCESS = 1,
  BACK_TO_LOGIN = 2,
}

const Login = ({ open, setOpen }) => {
  const { setUserLoginData } = useAuthMethods();
  const [isLoginForm, setIsLoginForm] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const userService = UserService();

  const schema = z.object({
    username: z.string().min(2).max(20),
    password: z.string().min(1).max(20),
  });
  type LoginFormSchema = z.infer<typeof schema>;

  const {
    register,
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
    setOpen(false);
  }

  function onCloseRegisterForm(type: RegisterFormCloseType) {
    if (type === RegisterFormCloseType.REGISTER_SUCCESS) {
      setOpenToast(true);
    }
    setIsLoginForm(true);
  }

  function onNewAccCreate() {
    setIsLoginForm(false);
  }

  React.useEffect(() => {
    setIsLoginForm(true);
  }, []);

  return (
    <>
      {open && (
        <>
          <Dialog open={isLoginForm} color="primary">
            <DialogContent color="secondary">
              <form className="login-form min-w-[350px]" onSubmit={handleSubmit(onLoginClick)}>
                <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
                  Please enter your credentials
                </span>

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
                  <div className="flex flex-col justify-end gap-3 mb-5">
                    <span className="fsr-14 inter float-end">
                      <a href="" className="ml-2" style={{ color: '#266FDC' }}>
                        Forgot password
                      </a>
                    </span>
                    <Button disabled={!(isDirty && isValid)} color="success" type="submit" variant="contained">
                      Submit
                    </Button>
                  </div>
                </DialogActions>
              </form>
              <div onClick={() => setOpen(false)} className="w-4 h-4 absolute top-5 right-8 cursor-pointer">
                <CloseIcon />
              </div>

              <span onClick={() => onNewAccCreate()} className="fsr-14 inter float-end cursor-pointer">
                New to blog?
                <a className="ml-2" style={{ color: '#266FDC' }}>
                  Create an account
                </a>
              </span>
            </DialogContent>
          </Dialog>

          <Register open={!isLoginForm} setOpen={setOpen} onCloseRegisterForm={onCloseRegisterForm} />

          <Toastr msg={'Registeration successfull! Login to continue.'} type={MessageIconTypeEnum.SUCCESS} visibility={openToast} visibilitySetter={setOpenToast} />
        </>
      )}
    </>
  );
};

export default Login;
