import React from 'react';
import Category from './Category';
import useCategories from '@hooks/useCategories';
import { ICategories } from '@models/post_model';

interface ICategoriesProp {
  img_n_name: boolean;
  showAll?: boolean;
}

const Categories = ({ img_n_name, showAll = false }: ICategoriesProp) => {
  const [categories, setCategories] = React.useState<ICategories[]>();
  const { getCategories } = useCategories();

  async function _getCategories() {
    const cat = await getCategories();
    setCategories(cat);
  }

  React.useEffect(() => {
    _getCategories();
  }, []);

  return (
    <div className="categories mb-14">
      <span className="fsr-25 font-ib">{img_n_name ? 'Popular Categories' : 'Categories'}</span>

      <div className="flex flex-wrap mt-4" style={{ gap: img_n_name ? 40 : 12 }}>
        {categories?.slice(0, showAll ? -1 : 6)?.map((cat) => (
          <Category key={cat?.id} id={cat?.id} bColor={cat?.bgColor} imgSrc={cat?.img} catName={cat?.name} img_n_name={img_n_name} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
