import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import Posts from '@pages/posts/Posts';
import postService from '@services/postService';
import React from 'react';

const AllPosts = () => {
  const { getUserPosts } = postService();
  const [posts, setPosts] = React.useState<IPostDetails[]>([]);

  async function getAllUserPosts() {
    const res = await getUserPosts();
    setPosts(res);
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
