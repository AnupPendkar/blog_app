import useCategories from '@hooks/useCategories';
import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import CheckboxSelector from '@pages/shared-comp/CheckboxSelector';
import Posts from '@pages/shared-comp/posts/Posts';
import postService from '@services/postService';
import React from 'react';

const AllPosts = () => {
  const [posts, setPosts] = React.useState<IPostDetails[]>([]);
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [selectedCat, setSelectedCat] = React.useState<{ id: number; name: string }[]>([]);
  const { getUserPosts } = postService();
  const { getCategories } = useCategories();

  async function getAllUserPosts() {
    const res = await getUserPosts();
    if (res?.length > 0) {
      setPosts(res);
    }
  }

  async function getAllCategories() {
    const res = await getCategories();
    setCategories(res);
  }

  function handleChange(event) {
    const {
      target: { value },
    } = event;
    setSelectedCat(value);
  }

  React.useEffect(() => {
    getAllUserPosts();
    getAllCategories();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 lg:w-[60%] md:w-[80%] s:w-full">
        <div className="flex justify-between items-center">
          <span className="fsr-25 font-isb">All posts</span>
          <CheckboxSelector selectedCat={selectedCat} categories={categories} handleChange={handleChange} />
        </div>
        <Posts data={posts} viewMethod={PostViewEnum.COMPLETE} />
      </div>
    </div>
  );
};

export default AllPosts;
