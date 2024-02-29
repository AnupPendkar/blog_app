import React from 'react';
import design from '@assets/design1.png';
import Category from './Category';

interface ICategoriesProp {
  img_n_name: boolean;
}

const Categories = ({ img_n_name }: ICategoriesProp) => {
  return (
    <div className="categories mb-14">
      <span className="fsr-25 font-ib">{img_n_name ? 'Popular Categories' : 'Categories'}</span>

      <div className="flex flex-wrap mt-4" style={{ gap: img_n_name ? 40 : 12 }}>
        <Category bColor="#292130" imgSrc={design} catName="Fashion" img_n_name={img_n_name} />
        <Category bColor="#1E272A" imgSrc={design} catName="Food" img_n_name={img_n_name} />
        <Category bColor="#16193A" imgSrc={design} catName="Coding" img_n_name={img_n_name} />
        <Category bColor="#192A3D" imgSrc={design} catName="Style" img_n_name={img_n_name} />
        <Category bColor="#322122" imgSrc={design} catName="Travel" img_n_name={img_n_name} />
        <Category bColor="#3E3026" imgSrc={design} catName="Culture" img_n_name={img_n_name} />
      </div>
    </div>
  );
};

export default Categories;
