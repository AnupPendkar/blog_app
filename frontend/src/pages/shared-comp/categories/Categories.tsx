import React from 'react';
import design from '@assets/design1.png';
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
          <Category bColor={cat?.bgColor} imgSrc={cat?.img} catName={cat?.name} img_n_name={img_n_name} />
        ))}
      </div>
    </div>
  );
};

{
  /* <Category bColor="#1E272A" imgSrc={design} catName="Food" img_n_name={img_n_name} />
<Category bColor="#16193A" imgSrc={design} catName="Coding" img_n_name={img_n_name} />
<Category bColor="#192A3D" imgSrc={design} catName="Style" img_n_name={img_n_name} />
<Category bColor="#322122" imgSrc={design} catName="Travel" img_n_name={img_n_name} />
<Category bColor="#3E3026" imgSrc={design} catName="Culture" img_n_name={img_n_name} /> */
}

export default Categories;
