import React, { useRef, useState } from 'react';
import 'react-quill/dist/quill.bubble.css';
import PublishDialog from './PublishDialog';
import { useAppSelector } from '@redux/store';
import LoginPopup from '@components/login/Login';
import CustomQuill from '@pages/shared-comp/CustomQull';

const Write = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [openLogin, setOpenLogin] = useState(false);
  const [publishDialogVis, setPublishDialogVis] = useState(false);
  const { userLoggedIn } = useAppSelector((state) => state.user);

  async function onPublishClk() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    setPublishDialogVis(true);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10 mb-10">
      <div className="w-[80vw]">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          className="fsr-25 border-none focus:outline-none pl-4"
          placeholder="Title"
          style={{ background: 'transparent' }}
        />

        <CustomQuill value={value} setValue={setValue} readonly={false} />
      </div>

      <button className="absolute top-20 right-10 px-3 py-1 rounded-md font-isb" onClick={() => onPublishClk()} style={{ background: '#1A8916', color: '#ffffff' }}>
        Publish
      </button>

      {publishDialogVis && <PublishDialog title={title} content={value} />}

      <LoginPopup open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default Write;
