import { MessageIconTypeEnum } from '@models/common';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';

interface IToastrProps {
  type: MessageIconTypeEnum;
  msg: string;
  visibility: boolean;
  visibilitySetter: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toastr = ({ type, msg, visibility, visibilitySetter }: IToastrProps) => {

  function getAlertElmAccordingType(): AlertColor {
    switch (type) {
      case MessageIconTypeEnum.SUCCESS:
        return 'success';

      case MessageIconTypeEnum.SUCCESS:
        return 'info';

      case MessageIconTypeEnum.SUCCESS:
        return 'warning';

      case MessageIconTypeEnum.SUCCESS:
        return 'error';
    }
  }

  return (
    <Snackbar
      autoHideDuration={3000}
      open={visibility}
      color="primary"
      onClose={() => visibilitySetter(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={(theme) => ({
        minWidth: 400,
        boxShadow: '0px 0px 15px 1px rgba(128, 128, 128, 0.4)',
        borderRadius: 1,
      })}
    >
      {}

      <Alert onClose={() => visibilitySetter(false)} severity={getAlertElmAccordingType()} sx={{ width: '100%' }}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

export default Toastr;
