import { PostViewEnum, ProfileTypeEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import { IUserAboutAPI } from '@models/user_service_model';
import { Button } from '@mui/material';
import CustomQuill from '@pages/shared-comp/CustomQull';
import Posts from '@pages/shared-comp/posts/Posts';
import { useAppSelector } from '@redux/store';
import UserService from '@services/userService';
import { isPropEmpty } from '@shared/utilfunctions';
import React from 'react';

interface IProfileTabProps {
  tabType: ProfileTypeEnum;
  postsData: IPostDetails[];
  aboutData: IUserAboutAPI;
  isAuthorVis: boolean;
}

const ProfileTab = ({ tabType, postsData, aboutData, isAuthorVis }: IProfileTabProps) => {
  const [aboutVal, setAboutVal] = React.useState<string>();
  const [showEditor, setEditorVis] = React.useState(false);
  const [readonly, setReadonly] = React.useState(true);

  const { setAboutDetails } = UserService();

  async function onSaveClk() {
    await setAboutDetails(aboutVal, isPropEmpty(aboutData) ? 'post' : 'put');
    setReadonly(true);
  }

  function onCancelClk() {
    setReadonly(true);
    setEditorVis(false);
  }

  React.useEffect(() => {
    if (!isPropEmpty(aboutData?.desc)) {
      setEditorVis(true);
    }

    setAboutVal(aboutData?.desc);
  }, [aboutData]);

  return (
    <>
      {tabType === ProfileTypeEnum.POSTS ? (
        <Posts data={postsData} viewMethod={PostViewEnum.COMPLETE} />
      ) : (
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
