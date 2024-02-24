import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import postService from '@services/postService';
import UserService from '@services/userService';
import PublishDialog from './PublishDialog';

const Write = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [publishDialogVis, setPublishDialogVis] = useState(false);
  const [top, setTop] = useState(12);
  const [btnVisiblity, setBtnVisibility] = useState(true);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const editorRef = useRef(null);
  const { publishPost } = postService();

  const modules = {
    toolbar: [
      ['bold', 'italic', 'link'],
      [{ script: 'sub' }, { script: 'super' }],
      ['underline', 'strike'],
    ],
  };

  const { uploadImg } = UserService();

  function getUploadedImg(file) {
    return new Promise(async (resolve) => {
      const res = await uploadImg(file);
      resolve(res?.path);
    });
  }

  function handleImageInsert() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = async () => {
      const file = input.files[0];

      const imgUrl = await getUploadedImg(file);

      const editor = editorRef.current.getEditor();
      const currIdx = editor.getLength();

      editorRef.current.getEditor().insertEmbed(currIdx - 1, 'image', imgUrl, 'user');
      editorRef.current.getEditor().insertText(currIdx, '\n', 'user');
    };

    input.click();
    setBtnVisibility(false);
    setIsBtnClicked(false);
  }

  function handleCodeBlockInsert() {
    const editor = editorRef.current.getEditor();
    const currIdx = editor.getLength();

    editorRef.current.getEditor()?.insertEmbed(currIdx - 1, 'code-block', 'user');
    editorRef.current.getEditor().insertText(currIdx, '\n', 'user');

    setBtnVisibility(false);
    setIsBtnClicked(false);
  }

  function handleBlockQuoteInsert() {
    const editor = editorRef.current.getEditor();
    const currIdx = editor.getLength();

    editorRef.current.getEditor()?.insertEmbed(currIdx - 1, 'blockquote', 'user');
    editorRef.current.getEditor().insertText(currIdx, '\n', 'user');

    setBtnVisibility(false);
    setIsBtnClicked(false);
  }

  function onButtonClick() {
    setIsBtnClicked((prev) => !prev);
  }

  function setButtonTopOffset(newTop: number) {
    setTop(newTop);
    setBtnVisibility(true);
  }

  function onChangeDetection(e) {
    const a = editorRef.current?.editor?.getLeaf(e?.index);
    if (a === undefined) {
      return;
    }

    const domNode = a[0]?.parent?.domNode;
    const isContentAvailable = domNode?.textContent.length > 0;

    if (!isContentAvailable) {
      setButtonTopOffset(a[0]?.parent?.domNode?.offsetTop);
    } else {
      setBtnVisibility(false);
    }
  }

  async function onPublishClk() {
    setPublishDialogVis(true);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10 mb-10">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text"
        className="fsr-25 border-none focus:outline-none pl-4"
        placeholder="Title"
        style={{ width: '80vw', background: 'transparent' }}
      />
      <div className="flex flex-col items-center justify-center w-full relative" style={{ width: '80vw' }}>
        <ReactQuill
          className="quill_input"
          modules={modules}
          theme="bubble"
          value={value}
          onChange={setValue}
          onChangeSelection={(e) => onChangeDetection(e)}
          ref={editorRef}
          placeholder="Tell your story ..."
        />

        {btnVisiblity && (
          <div
            className="w-9 h-9 flex items-center justify-center cursor-pointer absolute px-3 py-1 -left-8"
            style={{ borderRadius: '50%', border: '2px solid #68B26C', top: top }}
            onClick={onButtonClick}
          >
            <AddOutlinedIcon style={{ width: 20 }} />
          </div>
        )}

        {isBtnClicked && (
          <div
            className="flex items-center absolute gap-4 px-3 py-2 left-5 rounded-md"
            style={{
              background: '#444444',
              top: top - 5,
            }}
          >
            <div className="w-7 h-7 flex items-center justify-center cursor-pointer" style={{ borderRadius: '50%', border: '2px solid #68B26C' }} onClick={handleImageInsert}>
              <AddPhotoAlternateOutlinedIcon style={{ width: 14, color: '#ffffff' }} />
            </div>
            <div className="w-7 h-7 flex items-center justify-center cursor-pointer" style={{ borderRadius: '50%', border: '2px solid #68B26C' }} onClick={handleCodeBlockInsert}>
              <CodeOutlinedIcon style={{ width: 14, color: '#ffffff' }} />
            </div>

            <div className="w-7 h-7 flex items-center justify-center cursor-pointer" style={{ borderRadius: '50%', border: '2px solid #68B26C' }} onClick={handleBlockQuoteInsert}>
              <FormatQuoteRoundedIcon style={{ width: 14, color: '#ffffff' }} />
            </div>
          </div>
        )}
      </div>

      <button className="absolute top-20 right-10 px-3 py-1 rounded-md font-isb" onClick={() => onPublishClk()} style={{ background: '#1A8916', color: '#ffffff' }}>
        Publish
      </button>

      {publishDialogVis && <PublishDialog title={title} content={value} />}
    </div>
  );
};

export default Write;
