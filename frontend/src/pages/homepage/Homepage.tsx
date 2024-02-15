import React from 'react';
import linkedin from '@assets/linkedin.png';
import Categories from './categories/Categories';
import Posts from './posts/Posts';
import { PostViewEnum } from '@models/homepage';
import Comments from './comments/Comments';

const Homepage = () => {
  return (
    <div className="homepage flex items-center justify-center">
      <div className="mt-20 w-4/5">
        <div className="landing-txt">
          <span className="fsr-55 font-ib mr-5">Hey, Lorem ipsum dolor sit amet!</span>
          <span className="fsr-55 mont">Discover my stories and creative ideas.</span>
        </div>

        <div className="featured-blog mt-14 mb-14 flex gap-1 items-center justify-between">
          <div className="basis-1/2 flex items-center justify-center">
            <img className="w-70 h-70" src={linkedin} alt="" />
          </div>
          <div className="blog_card basis-1/2">
            <span className="blog_title">Simple ways to inspire your inner innovator.</span>
            <span className="blog-para" style={{ color: '#9E9D9E' }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi odio explicabo quod nobis aut alias perspiciatis error maxime? Perferendis a voluptatem excepturi
              architecto dicta quae aliquam quasi atque hic. Quae!
            </span>

            <button className="blog_button" style={{ color: 'rgb(98,97,98)', backgroundColor: '#C0C0C0' }}>
              Read More
            </button>
          </div>
        </div>

        <Categories img_n_name={true} />

        <div className="flex">
          <div className="section basis-3/4">
            <Posts postView={PostViewEnum.PARTIAL} />
            <Comments />
          </div>
          <div className="section basis-1/4">
            <Posts postView={PostViewEnum.TITLE_ONLY} />
            <Categories img_n_name={false} />
            <Posts postView={PostViewEnum.TITLE_WITH_IMG} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
