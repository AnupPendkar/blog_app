import { AuthStateEnum } from '@models/user_service_model';
import { Dialog, Button, DialogContent, TextField, IconButton, DialogActions } from '@mui/material';
import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import CloseIcon from '@mui/icons-material/Close';
import UserService from '@services/userService';

interface IGenerateOtpProp {
  setOpen: (flag: boolean) => {};
  setAuthState: (state: AuthStateEnum) => void;
  setToastrMsg: (msg: string) => void;
}

const GenerateOtp = ({ setOpen, setAuthState, setToastrMsg }: IGenerateOtpProp) => {
  const [otp, setOtp] = React.useState('');
  const [email, setEmail] = React.useState('');
  const { generateOtp } = UserService();

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  function handleGenerateOTPClk() {
    generateOtp(email);
    console.log(email, otp);
  }

  return (
    <Dialog open={true} color="primary">
      <DialogContent color="secondary">
        <div className="login-form min-w-[330px]">
          <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
            Generate OTP
          </span>

          <div className="field mt-5 mb-4 flex justify-between items-center">
            <label className="field-label" htmlFor="email">
              Email:
            </label>

            <div className="flex flex-col relative">
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </div>
          </div>

          <div className="field mb-1 relative flex justify-between items-center">
            <label className="field-label" htmlFor="password">
              OTP:
            </label>

            <MuiOtpInput sx={{ maxWidth: 240 }} value={otp} onChange={handleChange} />
          </div>

          <DialogActions>
            <div className="flex flex-col justify-end mt-3 mb-5">
              <Button disabled={otp.length !== 4 || email === ''} onClick={handleGenerateOTPClk} color="success" type="submit" variant="contained">
                Request OTP
              </Button>
            </div>
          </DialogActions>
        </div>

        <div onClick={() => setOpen(false)} className="w-4 h-4 absolute top-5 right-8 cursor-pointer">
          <CloseIcon />
        </div>

        <span onClick={() => setAuthState(AuthStateEnum.LOGIN)} className="fsr-14 inter float-end cursor-pointer" style={{ color: '#266FDC' }}>
          Back to login
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateOtp;
