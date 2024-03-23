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
import facebook from '@assets/facebook.png';
import instagram from '@assets/instagram.png';
import twitter from '@assets/twitter.png';
import linkedin from '@assets/linkedin.png';
import GenerateOtp from '@components/generate-otp/GenerateOtp';
import ResetPassword from '@components/reset-password/ResetPassword';
import { AuthStateEnum } from '@models/user_service_model';

export enum RegisterFormCloseType {
  REGISTER_SUCCESS = 1,
  BACK_TO_LOGIN = 2,
}

const Login = ({ open, setOpen }) => {
  const { setUserLoginData } = useAuthMethods();
  const [authState, setAuthState] = useState<AuthStateEnum>();
  const [toastrMsg, setToastrMsg] = useState<string>('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const userService = UserService();

  const schema = z.object({
    email: z.string().min(2).max(40),
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
      email: credentials.email,
      password: credentials.password,
    });

    setUserLoginData(res?.access, res?.refresh);
    setOpen(false);
  }

  function handleForgotPassClk() {
    setAuthState(AuthStateEnum.GENERATE_OTP);
  }

  async function onGoogleClk() {
    // const res = await userService.logout();
    window.open('http://localhost:8005/api/auth/google', '_self');

    // console.log(res);
  }

  React.useEffect(() => {
    setAuthState(AuthStateEnum.LOGIN);
  }, []);

  return (
    <>
      {open && (
        <>
          {authState === AuthStateEnum.LOGIN && (
            <Dialog open={true} color="primary">
              <DialogContent color="secondary">
                <form className="login-form min-w-[250px]" onSubmit={handleSubmit(onLoginClick)}>
                  <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
                    Please enter your credentials
                  </span>

                  <div className="field mt-5 mb-4 flex justify-between items-center">
                    <label className="field-label basis-1/3" htmlFor="email">
                      Email:
                    </label>

                    <div className="basis-2/3">
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
                            caretColor: '#191919 !important',
                          },
                        }}
                      ></TextField>
                    </div>
                  </div>

                  <div className="field mb-1 relative flex justify-between items-center">
                    <label className="field-label basis-1/3" htmlFor="password">
                      Password:
                    </label>

                    <div className="flex flex-col relative basis-2/3">
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
                            caretColor: '#191919 !important',
                          },
                        }}
                      ></TextField>
                      <IconButton onClick={() => setPasswordVisibility((state) => !state)} className="right-1" sx={{ position: 'absolute', color: '#191919' }}>
                        {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </div>
                  </div>

                  <DialogActions>
                    <div className="flex flex-col justify-end gap-3 mb-5 mt-1">
                      <span onClick={handleForgotPassClk} className="fsr-14 inter float-end cursor-pointer">
                        <a className="ml-2" style={{ color: '#266FDC' }}>
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

                <span onClick={() => setAuthState(AuthStateEnum.REGISTER)} className="fsr-14 inter float-end cursor-pointer">
                  New to blog?
                  <a className="ml-2" style={{ color: '#266FDC' }}>
                    Create an account
                  </a>
                </span>
                <div className="logos flex items-center select-none">
                  {/* <img className="w-5 mr-3 cursor-pointer" onClick={onGoogleClk} src={facebook} alt="" />
                  <img className="w-5 mr-3 cursor-pointer" src={instagram} alt="" />
                  <img className="w-5 mr-3 cursor-pointer" src={twitter} alt="" />
                  <img className="w-5 mr-3 cursor-pointer" src={linkedin} alt="" /> */}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Register */}
          {authState === AuthStateEnum.REGISTER && <Register setOpen={setOpen} setToastrMsg={setToastrMsg} setAuthState={setAuthState} />}

          {/* Reset Password */}
          {authState === AuthStateEnum.GENERATE_OTP && <GenerateOtp setOpen={setOpen} _setEmail={setEmail} setToastrMsg={setToastrMsg} setAuthState={setAuthState} />}
          {authState === AuthStateEnum.RESET_PASSWORD && <ResetPassword email={email} setOpen={setOpen} setToastrMsg={setToastrMsg} setAuthState={setAuthState} />}

          <Toastr msg={toastrMsg} type={MessageIconTypeEnum.SUCCESS} visibility={toastrMsg !== ''} visibilitySetter={() => setToastrMsg('')} />
        </>
      )}
    </>
  );
};

export default Login;
