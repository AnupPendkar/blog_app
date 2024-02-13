import './login.scss';
import React, { useEffect, useState } from 'react';
import { getHashedString } from '@shared/utilfunctions';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@redux/store';
import useAuthMethods from '@hooks/useAuthMethods';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconButton, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import UserService from '@services/userService';
import { AppRoutesEnum } from '@shared/appRotues';

const Login = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const { setUserLoginData } = useAuthMethods();
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
      // password: getHashedString(credentials.password),
      client_ip: 'http://172.16.120.20:3200',
    });

    setUserLoginData(res?.access, res?.refresh);
    navigate(AppRoutesEnum.DATA_CAPTURE);
  }

  useEffect(() => {
    if (user.userLoggedIn) {
      navigate(AppRoutesEnum.DATA_CAPTURE);
    }
  }, []);

  return (
    <div className="login">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit(onLoginClick)}>
          {/* <img className="w-20 self-center" src={logo} alt="CTMS logo" /> */}
          <span style={{ alignSelf: 'center' }}>Please enter your credentials</span>
          <div className="field">
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

          <div className="field relative">
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
          <button disabled={!(isDirty && isValid)} className="login-submit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
