import { AuthStateEnum } from '@models/user_service_model';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Dialog, Button, DialogContent, TextField, IconButton, DialogActions } from '@mui/material';
import UserService from '@services/userService';

interface IResetPasswordProp {
  setOpen: (flag: boolean) => {};
  email: string;
  setAuthState: (state: AuthStateEnum) => void;
  setToastrMsg: (msg: string) => void;
}

const ResetPassword = ({ setOpen, setAuthState, email, setToastrMsg }: IResetPasswordProp) => {
  const [isPasswordVisible, setPasswordVisibility] = React.useState(false);
  const { resetPassword } = UserService();

  const schema = z
    .object({
      password: z.string().min(1, { message: 'password is too short' }).max(20, { message: 'Username is too long' }),
      confirmPassword: z.string().min(1, { message: 'password is too short' }).max(20, { message: 'Username is too long' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  type RegisterFormSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(schema),
  });

  function handleCloseClk() {
    setAuthState(AuthStateEnum.LOGIN);
    setOpen(false);
  }

  async function handleConfirmClk(data: RegisterFormSchema) {
    await resetPassword(email, data?.password);
    setToastrMsg('Password has been reset!');
    setAuthState(AuthStateEnum.LOGIN);
  }

  return (
    <Dialog open={true} color="primary">
      <DialogContent color="secondary">
        <form className="login-form min-w-[250px]" onSubmit={handleSubmit(handleConfirmClk)}>
          <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
            Set Password
          </span>

          <div className="field mt-5 mb-4 flex justify-between items-center relative">
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
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
