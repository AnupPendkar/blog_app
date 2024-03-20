import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton } from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IMessageBoxEmitter, MessageBoxCloseTypeEnum, MessageBoxProps, MessageIconTypeEnum, PopupActionEnum } from '@models/common';
import { useAppDispatch } from '@redux/store';
import { setMessageDialogClose } from '@redux/actions/notificationActions';

const MessageBox = ({ dialogDetails, confirmBtnEmitter }: { dialogDetails: MessageBoxProps; confirmBtnEmitter: (data: IMessageBoxEmitter) => void }) => {
  const [open, setOpen] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  function handleClose() {
    setOpen(false);
    confirmBtnEmitter({ action: PopupActionEnum.CANCEL });
  }

  function handleSubmitBtn() {
    dispatch(setMessageDialogClose(dialogDetails?.confirmFor))
    confirmBtnEmitter({ action: PopupActionEnum.SUBMIT });
  }

  const MessageIcon = () => {
    switch (dialogDetails?.iconType) {
      case MessageIconTypeEnum.SUCCESS:
        return <CheckCircleOutlinedIcon />;

      case MessageIconTypeEnum.INFO:
        return <InfoOutlinedIcon />;

      case MessageIconTypeEnum.ERROR:
        return <DangerousOutlinedIcon />;

      case MessageIconTypeEnum.WARNING:
        return <ReportGmailerrorredIcon />;

      default:
        return <InfoOutlinedIcon />;
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} PaperProps={{ sx: { minWidth: 400, maxWidth: 450 } }}>
      <DialogTitle className="flex items-center">
        <IconButton sx={{ pl: 0 }} color="error">
          <MessageIcon />
        </IconButton>
        <span className="fsr-22 font-isb">{dialogDetails?.title}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogDetails?.content}</DialogContentText>
        <DialogActions sx={{ mt: 2 }}>
          {dialogDetails?.closeMsg && (
            <Button color="cancel" onClick={handleClose} variant="contained">
              {dialogDetails?.closeMsg}
            </Button>
          )}

          <Button color="success" onClick={handleSubmitBtn} variant="contained">
            {dialogDetails?.confirmMsg ?? 'Ok'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default MessageBox;
