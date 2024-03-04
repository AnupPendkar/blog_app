import { PostViewEnum, ProfileTypeEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import Posts from '@pages/shared-comp/posts/Posts';
import React from 'react';

interface IProfileTabProps {
  tabType: ProfileTypeEnum;
  postsData: IPostDetails[];
  aboutData: string;
}

const ProfileTab = ({ tabType, postsData, aboutData }: IProfileTabProps) => {
  return <>{tabType === ProfileTypeEnum.POSTS ? <Posts data={postsData} viewMethod={PostViewEnum.COMPLETE} /> : <span>{aboutData}</span>}</>;
};

export default ProfileTab;
