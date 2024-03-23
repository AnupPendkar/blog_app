import { AuthStateEnum } from '@models/user_service_model';
import { Dialog, Button, DialogContent, TextField, IconButton, DialogActions } from '@mui/material';
import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import CloseIcon from '@mui/icons-material/Close';
import UserService from '@services/userService';
import { convertMsIntoMinSec } from '@shared/utilfunctions';

interface IGenerateOtpProp {
  setOpen: (flag: boolean) => {};
  _setEmail: (email: string) => void;
  setAuthState: (state: AuthStateEnum) => void;
  setToastrMsg: (msg: string) => void;
}

const GenerateOtp = ({ setOpen, setAuthState, _setEmail, setToastrMsg }: IGenerateOtpProp) => {
  const [otp, setOtp] = React.useState('');
  const [timer, setTimer] = React.useState(30000);
  const [isOtpGenerated, setOtpGenerated] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const { generateOtp, isEnteredOtpAuthentic } = UserService();

  const timeoutRef = React.useRef<number>();

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  async function handleGenerateOTPClk() {
    await generateOtp(email);
    setOtpGenerated(true);
    setTimer(30000);
    initiateTimer();
  }

  async function handleSubmitOTPClk() {
    await isEnteredOtpAuthentic(otp, email);
    _setEmail(email);
    setAuthState(AuthStateEnum.RESET_PASSWORD);
  }

  function handleNewOTPClk() {
    handleGenerateOTPClk();
  }

  function handleCloseClk() {
    setAuthState(AuthStateEnum.LOGIN);
    setOpen(false);
  }

  function initiateTimer() {
    timeoutRef.current = setInterval(() => {
      setTimer((prevSeconds) => prevSeconds - 1000);
    }, 1000);
  }

  React.useEffect(() => {
    if (timer === 0) {
      clearInterval(timeoutRef.current);
    }
  }, [timer]);

  return (
    <Dialog open={true} color="primary">
      <DialogContent color="secondary">
        <div className="login-form min-w-[250px]">
          <span className="fsr-18 font-im" style={{ alignSelf: 'center' }}>
            {isOtpGenerated ? 'Enter OTP' : 'Generate OTP'}
          </span>

          {!isOtpGenerated ? (
            <div className="field mt-5 mb-4 flex justify-between items-center">
              <label className="field-label basis-1/3" htmlFor="email">
                Email:
              </label>

              <div className="flex flex-col basis-2/3 relative">
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
          ) : (
            <div className="field mt-5 mb-1 relative flex justify-between items-center">
              <label className="field-label w-[20%]" htmlFor="password">
                OTP:
              </label>

              <div className="w-[80%]">
                <MuiOtpInput sx={{ maxWidth: 240 }} value={otp} onChange={handleChange} />
              </div>
            </div>
          )}

          <DialogActions>
            <div className="flex flex-col items-end gap-2 justify-end mt-3 mb-5">
              {!isOtpGenerated ? (
                <Button disabled={email === ''} onClick={handleGenerateOTPClk} color="success" type="submit" variant="contained">
                  Request OTP
                </Button>
              ) : (
                <>
                  <Button disabled={timer !== 0} onClick={handleNewOTPClk} color="success" type="submit" variant="contained">
                    {timer !== 0 && (
                      <span className="flex items-center mr-2 fsr-12" style={{ color: '#ffffff' }}>
                        <span className="loader_anim mr-1"></span>
                        {convertMsIntoMinSec(timer)}
                      </span>
                    )}
                    Resend OTP
                  </Button>
                  <Button disabled={otp?.length < 4} onClick={handleSubmitOTPClk} color="success" type="submit" variant="contained">
                    Submit
                  </Button>
                </>
              )}
            </div>
          </DialogActions>
        </div>

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

export default GenerateOtp;
