import React from 'react';
import Category from './Category';
import useCategories from '@hooks/useCategories';
import { ICategories } from '@models/post_model';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutesEnum } from '@shared/appRotues';

interface ICategoriesProp {
  img_n_name: boolean;
  lableName: string;
  showAll?: boolean;
}

const Categories = ({ img_n_name, lableName, showAll = false }: ICategoriesProp) => {
  const [categories, setCategories] = React.useState<ICategories[]>();
  const { getCategories } = useCategories();
  const navigate = useNavigate();

  async function _getCategories() {
    const cat = await getCategories();
    setCategories(cat);
  }

  React.useEffect(() => {
    _getCategories();
  }, []);

  return (
    <div className="categories mb-14">
      <span className="post__title fsr-25 font-ib">{lableName}</span>

      <div className="flex flex-wrap mt-4" style={{ gap: img_n_name ? 40 : 12 }}>
        {categories?.slice(0, showAll ? -1 : 6)?.map((cat) => (
          <Category key={cat?.id} id={cat?.id} bColor={cat?.bgColor} imgSrc={cat?.img} catName={cat?.name} img_n_name={img_n_name} />
        ))}
        {img_n_name === false && (
          <IconButton onClick={() => navigate(AppRoutesEnum.ALL_CATEGORIES)} title="Show All Categories" className="hover:-rotate-45">
            <EastRoundedIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Categories;
