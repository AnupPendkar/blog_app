import React from 'react';
import postService from '@services/postService';
import Posts from '@pages/shared-comp/posts/Posts';
import Categories from '@pages/shared-comp/categories/Categories';
import logo from '@assets/logo.png';
import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';

const Homepage = () => {
  const [editorPick, setEditorPick] = React.useState<IPostDetails[]>([]);
  const [recentPosts, setRecentPosts] = React.useState<IPostDetails[]>([]);
  const [popular, setPopular] = React.useState<IPostDetails[]>([]);
  const { getAllPosts, fetchFeaturedPosts } = postService();

  async function getAllUserPosts() {
    let postsData = [];
    const res = await getAllPosts(1, 3);

    postsData = res?.posts;
    setPopular(postsData);
  }

  async function getFeaturedPosts() {
    const editorsPickRes = await fetchFeaturedPosts(true);
    const recentPostsRes = await fetchFeaturedPosts(false);
    setEditorPick(editorsPickRes);
    setRecentPosts(recentPostsRes);
  }

  React.useEffect(() => {
    getAllUserPosts();
    getFeaturedPosts();
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
            <img className="w-[700px]" src={logo} alt="" />
          </div>
          <div className="blog_card basis-1/2">
            <span className="blog_title">StoryHaven</span>
            <span className="blog-para" style={{ color: '#9E9D9E' }}>
              StoryHaven is more than just a blogging platform; it's a hub for connection and collaboration. Engage with fellow writers through comments, likes, and shares, and
              discover new voices that resonate with your own.Whether you're a seasoned wordsmith or just starting your journey as a blogger, StoryHaven offers a user-friendly
              interface and a supportive community to help you thrive.
            </span>
          </div>
        </div>

        <div className="pt-6">
          <Categories img_n_name={true} lableName={'Popular Categories'} />
        </div>

        <div className="flex gap-10">
          <div className="section basis-3/4">
            <Posts data={recentPosts} viewMethod={PostViewEnum.PARTIAL} />
          </div>
          <div className="section basis-1/4">
            <Posts data={popular} viewMethod={PostViewEnum.TITLE_ONLY} />
            <Categories img_n_name={false} lableName={'Categories'} />
            <Posts data={editorPick} viewMethod={PostViewEnum.TITLE_WITH_IMG} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
