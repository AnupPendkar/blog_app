import React from 'react';
import ProfileTab from './ProfileTab';
import UserService from '@services/userService';
import Login from '@components/login/Login';
import postService from '@services/postService';
import facebook from '@assets/facebook.png';
import instagram from '@assets/instagram.png';
import twitter from '@assets/twitter.png';
import linkedin from '@assets/linkedin.png';
import blankUser from '@assets/blank_user.svg';
import EditProfileDialog from './EditProfileDialog';
import { Button } from '@mui/material';
import { ProfileTypeEnum } from '@models/homepage';
import { useParams } from 'react-router-dom';
import { IUserDetailsAPI } from '@models/user_service_model';
import { useAppSelector } from '@redux/store';
import { isPropEmpty } from '@shared/utilfunctions';

const Profile = () => {
  const [profileType, setProfileType] = React.useState<ProfileTypeEnum>(ProfileTypeEnum.POSTS);
  const [userData, setUserData] = React.useState<IUserDetailsAPI>();
  const [showEditProfilePop, setEditProfilePopVis] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const { userLoggedIn } = useAppSelector((state) => state.user);
  const { parsedUserInfo } = useAppSelector((state) => state?.user);
  const { fetchUserDetails } = UserService();
  const { onAuthorFollow } = postService();
  const { id } = useParams();

  async function getUserDetails() {
    const res = await fetchUserDetails(+id);
    setUserData(res);
  }

  function isAuthorIsVistor() {
    return parsedUserInfo?.id === +id;
  }

  async function onFollowClk() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    await onAuthorFollow(+id, !isUserAlreadyFollowing());
    getUserDetails();
  }

  async function onEditProfilePopClosed(closeType: string) {
    if (closeType === 'update') {
      await getUserDetails();
    }

    setEditProfilePopVis(false);
  }

  function isUserAlreadyFollowing() {
    return userData?.followers?.some((foll) => foll?.follower?.userId === parsedUserInfo?.id);
  }

  React.useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div className="flex flex-col lg:w-[50%] md:w-[70%] s:w-full px-5 py-5">
        <div className="flex gap-7 items-center">
          <img src={!isPropEmpty(userData?.profileImg) ? userData?.profileImg : blankUser} style={{ borderRadius: '50%', width: '55px', height: '55px' }} alt="" />
          <div className="flex flex-col">
            <span className="fsr-25 font-ib capitalize">{userData?.fullName}</span>
            <span className="fsr-16" style={{ color: '#6B6B6B' }}>
              {userData?.followers?.length} Followers
            </span>
          </div>
          {isAuthorIsVistor() && (
            <Button onClick={() => setEditProfilePopVis(true)} className="self-start" color="success" variant="outlined">
              Edit Profile
            </Button>
          )}
          <EditProfileDialog userData={userData} visibility={showEditProfilePop} onClose={onEditProfilePopClosed} />
        </div>
        <div className="profession sm:my-2">
          <span className="fsr-18" style={{ color: '#6B6B6B' }}>
            Sr. Mobile Developer
          </span>
        </div>
        <div className="flex items-center justify-between pr-7">
          {isUserAlreadyFollowing() ? (
            <Button onClick={onFollowClk} color="success" variant="contained" style={{ borderRadius: 10 }}>
              Following
            </Button>
          ) : (
            <Button onClick={onFollowClk} color="success" variant="contained" style={{ borderRadius: 10 }}>
              Follow
            </Button>
          )}
          <div className="logos flex items-center select-none">
            <img className="w-5 mr-3 cursor-pointer" src={facebook} alt="" />
            <img className="w-5 mr-3 cursor-pointer" src={instagram} alt="" />
            <img className="w-5 mr-3 cursor-pointer" src={twitter} alt="" />
            <img className="w-5 mr-3 cursor-pointer" src={linkedin} alt="" />
          </div>
        </div>

        <div className="tab flex mt-6">
          <div
            className="posts mx-2 my-1 px-1 py-1 cursor-pointer"
            onClick={() => setProfileType(ProfileTypeEnum.POSTS)}
            style={{ borderBottom: profileType === ProfileTypeEnum.POSTS ? '1px solid #6B6B6B' : 'none' }}
          >
            <span className="fsr-16 font-isb">Posts</span>
          </div>
          <div
            className="About mx-2 my-1 px-1 py-1 cursor-pointer"
            onClick={() => setProfileType(ProfileTypeEnum.ABOUT)}
            style={{ borderBottom: profileType === ProfileTypeEnum.ABOUT ? '1px solid #6B6B6B' : 'none' }}
          >
            <span className="fsr-16 font-isb">About</span>
          </div>
        </div>

        <ProfileTab tabType={profileType} postsData={userData?.posts} aboutData={userData?.about} isAuthorVis={isAuthorIsVistor()} />
      </div>

      <Login open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default Profile;
