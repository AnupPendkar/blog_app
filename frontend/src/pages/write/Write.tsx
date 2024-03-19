import React from 'react';
import 'react-quill/dist/quill.bubble.css';
import PublishDialog from './PublishDialog';
import LoginPopup from '@components/login/Login';
import CustomQuill from '@pages/shared-comp/CustomQull';
import { useAppSelector } from '@redux/store';

const Write = () => {
  const [title, setTitle] = React.useState('');
  const [value, setValue] = React.useState('');
  const [openLogin, setOpenLogin] = React.useState(false);
  const [publishDialogVis, setPublishDialogVis] = React.useState(false);
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
          className="fsr-25 border-none focus:outline-none pl-4 w-full"
          placeholder="Title"
          style={{ background: 'transparent' }}
        />

        <CustomQuill value={value} setValue={setValue} readonly={false} />
      </div>

      <button
        disabled={title === '' || value === ''}
        onClick={() => onPublishClk()}
        className="absolute top-20 right-10 px-3 py-1 fsr-16 rounded-md font-isb bg-[#1A8916] text-[#ffffff] disabled:bg-[#444444] disabled:text-[#f1f1f1] disabled:cursor-not-allowed"
      >
        Publish
      </button>
      {<PublishDialog visibility={publishDialogVis} title={title} content={value} isVisible={setPublishDialogVis} />}

      <LoginPopup open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default Write;
