import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import Posts from '@pages/shared-comp/posts/Posts';
import postService from '@services/postService';
import React from 'react';

const AllPosts = () => {
  const [posts, setPosts] = React.useState<IPostDetails[]>([]);
  const { getUserPosts } = postService();

  async function getAllUserPosts() {
    const res = await getUserPosts();
    if (res?.length > 0) {
      setPosts(res);
    }
  }

  React.useEffect(() => {
    getAllUserPosts();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 lg:w-[60%] md:w-[80%] s:w-full">
        <span className="fsr-25 font-isb">All posts</span>
        <Posts data={posts} viewMethod={PostViewEnum.COMPLETE} />
      </div>
    </div>
  );
};

export default AllPosts;
