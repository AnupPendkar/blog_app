import React from 'react';

interface ICategoryDetails {
  bColor: string;
  imgSrc: string;
  catName: string;
  img_n_name: boolean;
}

const Category = ({ bColor, imgSrc, catName, img_n_name }: ICategoryDetails) => {
  return (
    <div className={`category ${img_n_name ? 'popular' : 'all'}`} style={{ backgroundColor: bColor }}>
      {img_n_name && <img className="category_img" src={imgSrc} alt="" />}
      <span className="category_name">{catName}</span>
    </div>
  );
};

export default Category;
