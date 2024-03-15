import React from 'react';
import useCategories from '@hooks/useCategories';
import CheckboxSelector from '@pages/shared-comp/CheckboxSelector';
import Posts from '@pages/shared-comp/posts/Posts';
import postService from '@services/postService';
import { ICategories, IPostDetails } from '@models/post_model';
import { PostViewEnum } from '@models/homepage';
import { isPropEmpty } from '@shared/utilfunctions';
import { useParams } from 'react-router-dom';

const Discover = () => {
  const [posts, setPosts] = React.useState<IPostDetails[]>([]);
  const [categories, setCategories] = React.useState<ICategories[]>([]);
  const [selectedCat, setSelectedCat] = React.useState<number[]>([]);
  const { getAllPosts } = postService();
  const { getCategories } = useCategories();
  const { id } = useParams();

  async function getAllUserPosts() {
    const res = await getAllPosts(selectedCat);
    setPosts(res);
  }

  function setSelectedCategories() {
    if (isPropEmpty(id) || isNaN(+id)) {
      getAllUserPosts();
    } else {
      setSelectedCat((prev) => [...prev, +id]);
    }
  }

  async function getAllCategories() {
    const res = await getCategories();
    setCategories(res);
    setSelectedCategories();
  }

  function handleChange(event) {
    const {
      target: { value },
    } = event;
    setSelectedCat(value);
  }

  React.useEffect(() => {
    if (!isPropEmpty(selectedCat)) {
      getAllUserPosts();
    }
  }, [selectedCat]);

  React.useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 lg:w-[60%] md:w-[80%] s:w-full">
        <div className="flex justify-between items-center">
          <span className="fsr-25 font-isb">All posts</span>
          <div className="flex items-center">
            <CheckboxSelector selectedCat={selectedCat} categories={categories} handleChange={handleChange} />
          </div>
        </div>
        <Posts data={posts} viewMethod={PostViewEnum.COMPLETE} />
      </div>
    </div>
  );
};

export default Discover;
