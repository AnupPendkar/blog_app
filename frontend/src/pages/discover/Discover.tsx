import React from 'react';
import useCategories from '@hooks/useCategories';
import CheckboxSelector from '@pages/shared-comp/CheckboxSelector';
import Posts from '@pages/shared-comp/posts/Posts';
import postService from '@services/postService';
import { ICategories, IPostDetails } from '@models/post_model';
import { PostViewEnum } from '@models/homepage';
import { isPropEmpty } from '@shared/utilfunctions';
import { useParams } from 'react-router-dom';
import CustomPagination from '@components/pagination/Pagination';
import { useTheme } from '@mui/material';

const Discover = () => {
  const [posts, setPosts] = React.useState<IPostDetails[]>([]);
  const [categories, setCategories] = React.useState<ICategories[]>([]);
  const [selectedCat, setSelectedCat] = React.useState<number[]>([]);
  const { getAllPosts } = postService();
  const { getCategories } = useCategories();
  const totalCount = React.useRef(0);
  const pageNo = React.useRef(1);
  const recordsCount = React.useRef(10);
  const { id } = useParams();
  const theme = useTheme();

  async function getAllUserPosts() {
    const res = await getAllPosts(pageNo.current, recordsCount.current, selectedCat);
    totalCount.current = res?.count;
    setPosts(res?.posts);
  }

  function setSelectedCategories() {
    if (isPropEmpty(id) || isNaN(+id)) {
      getAllUserPosts();
    } else {
      setSelectedCat((prev) => [...prev, +id]);
    }
  }

  function onPageSelection(pageSize: number) {
    pageNo.current = pageSize;
    getAllUserPosts();
  }

  function onPageRecordsSelection(recordSize: number) {
    pageNo.current = 1;
    recordsCount.current = recordSize;
    getAllUserPosts();
  }

  async function getAllCategories() {
    const res = await getCategories();
    setCategories(res);
    setSelectedCategories();
  }

  function handleChange(event, value: ICategories[]) {
    setSelectedCat(value?.reduce((total, curr) => total.concat(curr?.id), []));
  }

  React.useEffect(() => {
    getAllUserPosts();
    if (!isPropEmpty(selectedCat)) {
    }
  }, [selectedCat]);

  React.useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 w-[90%] lg:w-[60%] md:w-[80%] sm:w-[90%]">
        <div
          className="flex flex-col gap-y-3 justify-between sm:flex-row sm:items-center sticky top-0 left-0 pt-2 mx-3 w-full -translate-y-[2px]"
          style={{ borderBottom: '1px solid rgba(158, 157, 158, 0.2)', background: theme?.palette?.primary?.main }}
        >
          <span className="fsr-25 post__title font-isb">All posts</span>
          <div className="flex items-center">
            <CheckboxSelector selectedCat={selectedCat} categories={categories} handleChange={handleChange} />
          </div>
        </div>
        <div className="flex flex-col">
          <Posts data={posts} viewMethod={PostViewEnum.COMPLETE} />

          <div className="flex items-end">
            <CustomPagination
              currentPage={pageNo.current}
              totalCount={totalCount.current}
              pageRecords={recordsCount.current}
              pageSelectionEmitter={onPageSelection}
              setPageRecordsEmitter={onPageRecordsSelection}
            ></CustomPagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
