import { Tooltip } from '@mui/material';
import React from 'react';
import blankImg from '@assets/blank_user.svg'

const ViewProfileTooltip = () => {
  return (
    <Tooltip title="profile" disableFocusListener>
      <div>
        <img src={blankImg} alt="" />
      </div>
    </Tooltip>
  );
};

export default ViewProfileTooltip;
