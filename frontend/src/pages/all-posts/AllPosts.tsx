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

  async function getAllUserPosts() {
    const res = await getUserPosts();
    setCategories([
      {
        id: 1,
        name: 'cat1',
      },
      {
        id: 2,
        name: 'cat2',
      },
      {
        id: 3,
        name: 'cat3',
      },
      {
        id: 4,
        name: 'cat4',
      },
      {
        id: 5,
        name: 'cat5',
      },
    ]);
    if (res?.length > 0) {
      setPosts(res);
    }
  }

  function handleChange(event) {
    const {
      target: { value },
    } = event;
    setSelectedCat(value);
  }

  React.useEffect(() => {
    getAllUserPosts();
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
