import React from 'react';
import CustomQuill from '@pages/shared-comp/CustomQull';
import Posts from '@pages/shared-comp/posts/Posts';
import WishlistPosts from './WishlistPosts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserService from '@services/userService';
import { PostViewEnum, ProfileTypeEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import { ICollectionsAPI, IUserAboutAPI } from '@models/user_service_model';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { isPropEmpty } from '@shared/utilfunctions';

interface IProfileTabProps {
  tabType: ProfileTypeEnum;
  postsData: IPostDetails[];
  collectionData: ICollectionsAPI[];
  aboutData: IUserAboutAPI;
  isAuthorVis: boolean;
}

const ProfileTab = ({ tabType, postsData, aboutData, collectionData, isAuthorVis }: IProfileTabProps) => {
  const [aboutVal, setAboutVal] = React.useState<string>();
  const [showEditor, setEditorVis] = React.useState(false);
  const [readonly, setReadonly] = React.useState(true);
  const [clickedCollId, setClickedCollId] = React.useState(-1000);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [_collectionData, _setCollectionData] = React.useState<ICollectionsAPI[]>([]);
  const { setAboutDetails, deleteCollection } = UserService();

  async function onSaveClk() {
    await setAboutDetails(aboutVal, isPropEmpty(aboutData) ? 'post' : 'put');
    setReadonly(true);
  }

  function onCancelClk() {
    setReadonly(true);
    setEditorVis(false);
  }

  function onCollectionClk(id: number) {
    if (id === clickedCollId) {
      setClickedCollId(-1000);
    } else {
      setClickedCollId(id);
    }
  }

  async function handleCollDelete(id: number) {
    await deleteCollection(id);
    _setCollectionData((prev) => prev?.filter((coll) => coll?.id !== id));
    setMoreAnchorEl(null);
  }

  React.useEffect(() => {
    if (!isPropEmpty(aboutData?.desc)) {
      setEditorVis(true);
    }

    setAboutVal(aboutData?.desc);
  }, [aboutData]);

  React.useEffect(() => {
    _setCollectionData(collectionData);
  }, [collectionData]);

  return (
    <>
      {tabType === ProfileTypeEnum.POSTS && <Posts data={postsData} viewMethod={PostViewEnum.COMPLETE} />}

      {tabType === ProfileTypeEnum.COLLECTIONS && (
        <div className="mt-3">
          {_collectionData?.map((coll) => (
            <div key={coll?.id} className="rounded-md mb-5" style={{ border: '1px solid #6B6B6B' }}>
              <div className="flex flex-col px-3 py-3 relative">
                <div className="flex items-center">
                  <span className="fsr-22 font-isb select-none">{coll?.name}</span>
                  <span className="fsr-15 font-isb text-[#6B6B6B] select-none ml-auto">{coll?.total} posts</span>
                  <IconButton onClick={(event) => setMoreAnchorEl(event.currentTarget)} className="ml-2">
                    <MoreVertIcon style={{ color: '#767882', width: 22, height: 22 }} />
                  </IconButton>
                  <Menu id="menu-appbar" anchorEl={moreAnchorEl} keepMounted open={Boolean(moreAnchorEl)} onClose={() => setMoreAnchorEl(null)}>
                    <MenuItem onClick={() => handleCollDelete(coll?.id)}>
                      <span className="fsr-14 font-isb">Delete</span>
                    </MenuItem>
                  </Menu>
                </div>
                <IconButton onClick={() => onCollectionClk(coll?.id)} className="self-center bottom-0" style={{ position: 'absolute' }}>
                  <KeyboardArrowDownIcon
                    style={{ color: '#767882', width: 20, height: 20, transition: 'transform 0.2s linear', transform: `rotate(${clickedCollId === coll?.id ? '180deg' : '0deg'})` }}
                  />
                </IconButton>
              </div>
              {clickedCollId === coll?.id && <WishlistPosts key={coll?.id} data={coll?.post} />}
            </div>
          ))}
        </div>
      )}

      {tabType === ProfileTypeEnum.ABOUT && (
        <div>
          {showEditor ? (
            <>
              <CustomQuill value={aboutVal} setValue={setAboutVal} readonly={readonly} />
              {isAuthorVis && (
                <>
                  {readonly ? (
                    <Button onClick={() => setReadonly(false)} color="success" variant="contained">
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button style={{ marginRight: '15px' }} onClick={onCancelClk} color="cancel" variant="contained">
                        Cancel
                      </Button>
                      <Button onClick={onSaveClk} color="success" variant="contained">
                        Save
                      </Button>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {isAuthorVis && (
                <div className="flex flex-col items-center gap-3 mt-10 px-10">
                  <span className="fsr-18 font-isb">Tell the world about yourself!</span>
                  <span className="fsr-16 inter mb-4">
                    Here’s where you can share more about yourself: your history, work experience, accomplishments, interests, dreams, and more. You can even add images and use
                    rich text to personalize your bio.
                  </span>

                  <Button onClick={() => setEditorVis(true)} color="success" variant="outlined">
                    Get Started
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileTab;
