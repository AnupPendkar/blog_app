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
  const { getAllPosts } = postService();

  async function getAllUserPosts() {
    let postsData = [];
    postsData = await getAllPosts();

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
      <div className="mt-[40px] w-4/5">
        <div className="landing-txt">
          <span className="fsr-55 font-ib mr-5">
            Hey, Blog aficionados! <br />
          </span>
          <span className="fsr-55 mont">Embark on a blog-fueled journey of self-expression and creativity.</span>
        </div>

        <div className="featured-blog mt-14 mb-14 flex gap-1 items-center justify-between">
          <div className="basis-1/2 flex items-center justify-center">
            <img className="w-70 h-70" src={linkedin} alt="" />
          </div>
          <div className="blog_card basis-1/2">
            <span className="blog_title">StoryHaven</span>
            <span className="blog-para" style={{ color: '#9E9D9E' }}>
              StoryHaven is more than just a blogging platform; it's a hub for connection and collaboration. Engage with fellow writers through comments, likes, and shares, and
              discover new voices that resonate with your own.Whether you're a seasoned wordsmith or just starting your journey as a blogger, StoryHaven offers a user-friendly
              interface and a supportive community to help you thrive.
            </span>

            {/* <button className="blog_button" style={{ color: 'rgb(98,97,98)', backgroundColor: '#C0C0C0' }}>
              Read More
            </button> */}
          </div>
        </div>

        <div className="pt-6">
          <Categories img_n_name={true} />
        </div>

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
