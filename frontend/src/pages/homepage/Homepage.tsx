import React, { useState } from 'react';
import linkedin from '@assets/linkedin.png';
import Categories from './categories/Categories';
import { PostViewEnum } from '@models/homepage';
import postService from '@services/postService';
import Posts from '@pages/posts/Posts';
import { IPostDetails } from '@models/post_model';

const Homepage = () => {
  const [editorPick, setEditorPick] = useState<IPostDetails[]>([]);
  const [recentPosts, setRecentPosts] = useState<IPostDetails[]>([]);
  const [popular, setPopular] = useState<IPostDetails[]>([]);
  const { getUserPosts } = postService();

  async function getAllUserPosts() {
    let postsData = [];
    postsData = await getUserPosts();

    if (postsData?.length > 3) {
      postsData = postsData.slice(0, 3);
    }

    setRecentPosts(postsData);
    setEditorPick(postsData);
    setPopular(postsData);
  }

  React.useEffect(() => {
    getAllUserPosts();
  }, []);

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

        <div className="flex gap-10">
          <div className="section basis-3/4">
            <Posts data={recentPosts} viewMethod={PostViewEnum.PARTIAL} />
          </div>
          <div className="section basis-1/4">
            <Posts data={popular} viewMethod={PostViewEnum.TITLE_ONLY} />
            <Categories img_n_name={false} />
            <Posts data={editorPick} viewMethod={PostViewEnum.TITLE_WITH_IMG} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
