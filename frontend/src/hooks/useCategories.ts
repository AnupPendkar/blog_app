import { ICategories } from '@models/post_model';
import postService from '@services/postService';
import React from 'react';
import Food from '@assets/food_category.jpg';
import Travel from '@assets/travel_category.jpg';
import Health from '@assets/health_category.jpg';
import Fitness from '@assets/fitness_category.jpg';
import Lifestyle from '@assets/lifestyle_category.jpg';
import Fashion from '@assets/gmail.png';
import Parenting from '@assets/gmail.png';
import Buiseness from '@assets/gmail.png';
import PersonalFinance from '@assets/gmail.png';
import Sports from '@assets/gmail.png';
import Coding from '@assets/gmail.png';
import Style from '@assets/gmail.png';
import Culture from '@assets/gmail.png';
import Study from '@assets/gmail.png';
import Work from '@assets/gmail.png';
import Gaming from '@assets/gmail.png';
import Tech from '@assets/gmail.png';
import Photography from '@assets/gmail.png';
import Nature from '@assets/gmail.png';
import Beauty from '@assets/gmail.png';
import Activity from '@assets/gmail.png';

const useCategories = () => {
  const { fetchCategories } = postService();

  const categoryMap = {
    1: {
      img: Food,
      bgColor: '#292130',
    },
    2: {
      img: Travel,
      bgColor: '#1E272A',
    },
    3: {
      img: Health,
      bgColor: '#16193A',
    },
    4: {
      img: Fitness,
      bgColor: '#192A3D',
    },
    5: {
      img: Lifestyle,
      bgColor: '#322122',
    },
    6: {
      img: Fashion,
      bgColor: '#3E3026',
    },
    7: {
      img: Parenting,
      bgColor: '#16193A',
    },
    8: {
      img: Buiseness,
      bgColor: '#292130',
    },
    9: {
      img: PersonalFinance,
      bgColor: '#322122',
    },
    10: {
      img: Sports,
      bgColor: '#1E272A',
    },
    11: {
      img: Coding,
      bgColor: '#192A3D',
    },
    12: {
      img: Style,
      bgColor: '#16193A',
    },
    13: {
      img: Culture,
      bgColor: '#1E272A',
    },
    14: {
      img: Study,
      bgColor: '#322122',
    },
    15: {
      img: Work,
      bgColor: '#3E3026',
    },
    16: {
      img: Gaming,
      bgColor: '#192A3D',
    },
    17: {
      img: Tech,
      bgColor: '#1E272A',
    },
    18: {
      img: Photography,
      bgColor: '#3E3026',
    },
    19: {
      img: Nature,
      bgColor: '#322122',
    },
    20: {
      img: Beauty,
      bgColor: '#192A3D',
    },
    21: {
      img: Activity,
      bgColor: '#16193A',
    },
  };

  function appendCategoryViewProp(categories: Array<ICategories>) {
    categories?.forEach((cat) => {
      cat.img = categoryMap[cat?.id]?.img;
      cat.bgColor = categoryMap[cat?.id]?.bgColor;
    });

    return categories?.map((cat) => cat);
  }

  async function getCategories() {
    const res = await fetchCategories();
    return appendCategoryViewProp(res);
  }

  return { getCategories };
};

export default useCategories;
