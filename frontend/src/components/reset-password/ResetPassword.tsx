import { AuthStateEnum } from '@models/user_service_model';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Dialog, Button, DialogContent, TextField, IconButton, DialogActions } from '@mui/material';

interface IResetPasswordProp {
  setOpen: (flag: boolean) => {};
  setAuthState: (state: AuthStateEnum) => void;
  setToastrMsg: (msg: string) => void;
}

const ResetPassword = ({ setOpen, setAuthState, setToastrMsg }: IResetPasswordProp) => {
  const [isPasswordVisible, setPasswordVisibility] = React.useState(false);

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

  function handleConfirmClk() {}

  return (
    <Dialog open={true} color="primary">
      <DialogContent color="secondary">
        <form className="login-form min-w-[390px]" onSubmit={handleSubmit(handleConfirmClk)}>
          <div className="field mb-1 relative flex justify-between items-center">
            <label className="field-label" htmlFor="password">
              Password:
            </label>

            <div className="flex flex-col relative">
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
            <label className="field-label" htmlFor="password">
              Confirm password:
            </label>

            <div className="flex flex-col relative">
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
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
