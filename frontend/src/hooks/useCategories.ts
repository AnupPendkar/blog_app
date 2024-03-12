import React from 'react';
import { ICategories } from '@models/post_model';
import postService from '@services/postService';
import Food from '@assets/food_category.jpg';
import Travel from '@assets/travel_category.jpg';
import Health from '@assets/health_category.jpg';
import Fitness from '@assets/fitness_category.jpg';
import Lifestyle from '@assets/lifestyle_category.jpg';
import Fashion from '@assets/fashion_category.jpg';
import Parenting from '@assets/parenting_category.jpg';
import Buiseness from '@assets/buisness_category.jpg';
import PersonalFinance from '@assets/personalFinance.jpg';
import Sports from '@assets/sports_category.jpg';
import Coding from '@assets/coding_category.jpg';
import Style from '@assets/style.jpg';
import Culture from '@assets/culture.jpg';
import Study from '@assets/study_category.jpg';
import Work from '@assets/work_culture.jpg';
import Gaming from '@assets/gaming_category.jpg';
import Tech from '@assets/tech_category.jpg';
import Photography from '@assets/photograpy.jpg';
import Nature from '@assets/nature.jpg';
import Beauty from '@assets/beauty.jpg';
import Activity from '@assets/activity.jpg';

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
