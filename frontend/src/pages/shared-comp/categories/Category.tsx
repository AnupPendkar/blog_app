import { AppRoutesEnum } from '@shared/appRotues';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ICategoryProp {
  id: number;
  bColor: string;
  imgSrc: string;
  catName: string;
  img_n_name: boolean;
}

const Category = ({ id, bColor, imgSrc, catName, img_n_name }: ICategoryProp) => {
  const navigate = useNavigate();

  function onCategoryClk () {
    navigate(AppRoutesEnum.DISCOVER + '/' + id)
  }

  return (
    <div onClick={onCategoryClk} className={`category ${img_n_name ? 'popular' : 'all'}`} style={{ backgroundColor: bColor }}>
      {img_n_name && <img className="category_img" src={imgSrc} alt="" />}
      <span className="category_name">{catName}</span>
    </div>
  );
};

export default Category;
