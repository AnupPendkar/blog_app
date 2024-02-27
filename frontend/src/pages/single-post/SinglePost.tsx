import React from 'react';
import design from '@assets/design3.png';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import postService from '@services/postService';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { isPropEmpty } from '@shared/utilfunctions';
import { AppRoutesEnum } from '@shared/appRotues';
import { useAppSelector } from '@redux/store';
import { IComment, IFollower, ILike, ISinglePost } from '@models/post_model';
import Comments from '@pages/homepage/comments/Comments';
import LoginPopup from '@components/login-popup/LoginPopup';

const SinglePost = () => {
  const [post, setPost] = React.useState<ISinglePost>(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [commentVis, setCommentVis] = React.useState(false);
  const { fetchLikesNCommentsByPostId, getPostById, postLike, onPostComment, onPostCommentReply, onAuthorFollow } = postService();
  const { id } = useParams();
  const { parsedUserInfo } = useAppSelector((state) => state?.user);
  const { userLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  async function getCurrentPostById() {
    if (isPropEmpty(id) || isNaN(+id)) {
      navigate(AppRoutesEnum.DISCOVER);
      return;
    }

    const res = await getPostById(+id);
    setPost(res?.post);
  }

  function constructDateTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date?.getFullYear()}-${date?.getMonth()}-${date?.getDay()}`;
  }

  function getPostLikesNComments(id: number): Promise<{
    likes: ILike[];
    comments: IComment[];
    followers: IFollower[];
  }> {
    return new Promise(async (resolve) => {
      const res = await fetchLikesNCommentsByPostId(post?.authorId, id);
      resolve(res);
    });
  }

  async function onFollowClick() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    await onAuthorFollow(post?.authorId, !isUserAlreadyFollowing());
    const res = await getPostLikesNComments(post?.id);
    setPost({
      ...post,
      author: {
        ...post?.author,
        followers: res?.followers,
      },
    });
  }

  async function onPostLike() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    await postLike(post?.id, !isUserAlreadyLiked());
    const res = await getPostLikesNComments(post?.id);
    setPost({ ...post, likes: res?.likes });
  }

  function isAuthorIsVistor() {
    return parsedUserInfo?.id === post?.author?.id;
  }

  function isUserAlreadyLiked() {
    return post?.likes?.some((like) => like?.userId === parsedUserInfo?.id);
  }

  function isUserAlreadyFollowing() {
    return post?.author?.followers?.some((follower) => follower?.follower === parsedUserInfo?.id);
  }

  async function onSubmitComment(comment: string, parentCommentId?: number) {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    if (isPropEmpty(parentCommentId)) {
      await onPostComment(post?.id, comment);
    } else {
      await onPostCommentReply(parentCommentId, comment);
    }

    const res = await getPostLikesNComments(post?.id);
    setPost({ ...post, comments: res?.comments });
  }

  React.useEffect(() => {
    getCurrentPostById();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 flex flex-col items-center justify-center lg:w-[40%] md:w-[70%] s:w-full">
        <div className="w-full flex flex-col mt-20">
          <span className="post-title fsr-30 font-ib mb-1">{post?.title}</span>
          <span className="post-desc fsr-22 inter mb-3" style={{ color: '#6B6B6B' }}>
            {post?.desc}
          </span>

          <div className="user flex items-center">
            <img className="w-16 h-16 mr-6" style={{ borderRadius: '50%' }} src={design} alt="" />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="fsr-16 inter mr-4" style={{ color: '#6B6B6B' }}>
                  {post?.author?.fullName}
                </span>

                {isUserAlreadyFollowing() ? (
                  <span onClick={onFollowClick} className="fsr-16 cursor-pointer" style={{ color: '#F03623' }}>
                    Following
                  </span>
                ) : (
                  <span onClick={onFollowClick} className="fsr-16 cursor-pointer" style={{ color: '#F03623' }}>
                    Follow
                  </span>
                )}

                <span className="fsr-16 ml-3" style={{ color: '#6B6B6B' }}>
                  {post?.author?.followers?.length}
                </span>
              </div>
              <div className="flex items-center fsr-16" style={{ color: '#6B6B6B' }}>
                <span className="mr-4">7 min read</span>
                <span>{constructDateTime(post?.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-5" style={{ height: 1, background: '#6B6B6B' }}></div>
          <div className="flex items-center py-2" style={{ color: '#6B6B6B' }}>
            <div onClick={onPostLike} className="cursor-pointer">
              {isUserAlreadyLiked() ? <FavoriteIcon style={{ color: 'tomato' }} /> : <FavoriteBorderOutlinedIcon />}
              <span className="fsr-14 mr-6 ml-2">{post?.likes?.length}</span>
            </div>

            <div onClick={() => setCommentVis(true)} className="cursor-pointer">
              <MessageOutlinedIcon style={{ width: 25 }} />
              <span className="fsr-14 ml-2">{post?.comments?.length}</span>
            </div>

            <div className="cursor-pointer ml-auto">
              <BookmarkBorderOutlinedIcon className="mr-6" style={{ width: 25 }} />
              <MoreHorizOutlinedIcon style={{ width: 25 }} />
            </div>
          </div>
          <div className="w-full" style={{ height: 1, background: '#6B6B6B' }}></div>
        </div>

        <div className="w-full mt-5">
          <ReactQuill className="quill_input" style={{ width: '100%' }} value={post?.content} readOnly={true} />
        </div>
      </div>

      <div className="absolute">
        <Comments data={post?.comments} open={commentVis} onSubmit={onSubmitComment} setOpen={setCommentVis} />
      </div>

      <LoginPopup open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default SinglePost;
