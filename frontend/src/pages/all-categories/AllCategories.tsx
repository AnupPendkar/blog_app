import Categories from '@pages/shared-comp/categories/Categories';
import React from 'react';

const AllCategories = () => {
  return (
    <div className="flex justify-center">
      <div className="lg:w-[60%] md:w-[70%] sm:w-[90%] w-[90%] mt-10">
        <Categories img_n_name={true} showAll={true} lableName={'Categories'} />
      </div>
    </div>
  );
};

export default AllCategories;
