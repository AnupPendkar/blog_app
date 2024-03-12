import useCategories from '@hooks/useCategories';
import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import { Button } from '@mui/material';
import CheckboxSelector from '@pages/shared-comp/CheckboxSelector';
import Posts from '@pages/shared-comp/posts/Posts';
import postService from '@services/postService';
import React from 'react';

const Discover = () => {
  const [posts, setPosts] = React.useState<IPostDetails[]>([]);
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [selectedCat, setSelectedCat] = React.useState<{ id: number; name: string }[]>([]);
  const { getAllPosts } = postService();
  const { getCategories } = useCategories();

  async function getAllUserPosts() {
    const res = await getAllPosts();
    setPosts(res);
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

  function onFilterClk() {}

  React.useEffect(() => {
    getAllUserPosts();
    getAllCategories();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 lg:w-[60%] md:w-[80%] s:w-full">
        <div className="flex justify-between items-center">
          <span className="fsr-25 font-isb">All posts</span>
          <div className="flex items-center">
            <CheckboxSelector selectedCat={selectedCat} categories={categories} handleChange={handleChange} />
            <Button className="h-fit py-1 px-3 ml-2" color="success" variant="outlined" onClick={() => onFilterClk()}>
              Apply filter
            </Button>
          </div>
        </div>
        <Posts data={posts} viewMethod={PostViewEnum.COMPLETE} />
      </div>
    </div>
  );
};

export default Discover;
