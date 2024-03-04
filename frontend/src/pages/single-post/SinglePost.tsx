import React from 'react';
import design from '@assets/design3.png';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import postService from '@services/postService';
import { useNavigate, useParams } from 'react-router-dom';
import { constructDateTime, isPropEmpty } from '@shared/utilfunctions';
import { AppRoutesEnum } from '@shared/appRotues';
import { useAppSelector } from '@redux/store';
import { ISinglePost, PostMethodEnum } from '@models/post_model';
import Login from '@components/login/Login';
import Comments from '@pages/shared-comp/comments/Comments';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import CustomQuill from '@pages/shared-comp/CustomQull';
import usePostRequestUtility from '@hooks/usePostRequestUtility';
import AddToCollections from '@pages/shared-comp/AddToCollections';

const SinglePost = () => {
  const [post, setPost] = React.useState<ISinglePost>(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [commentVis, setCommentVis] = React.useState(false);
  const [collections, setCollections] = React.useState([]);
  const [wishlistVis, setWishlistVis] = React.useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isContentEditable, setContentEditable] = React.useState(false);

  const [content, setContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');

  const { id } = useParams();
  const { parsedUserInfo } = useAppSelector((state) => state?.user);
  const { userLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { onPostAction, getPostById, onAuthorFollow, editPostDetails, deletePost } = postService();
  const { calculateReadingTime, getPostLikesNComments } = usePostRequestUtility();

  async function getCurrentPostById() {
    if (isPropEmpty(id) || isNaN(+id)) {
      navigate(AppRoutesEnum.DISCOVER);
      return;
    }

    const res = await getPostById(+id);
    setContent(res?.post?.content);
    setTitle(res?.post?.title);
    setDesc(res?.post?.desc);
    setCollections(res?.post?.collections);
    setPost(res?.post);
  }

  function handleMoreClick(event: React.MouseEvent<HTMLButtonElement>) {
    setMoreAnchorEl(event.currentTarget);
  }

  function isUserAlreadyWishlisted() {
    return collections?.some((coll) => coll?.collection?.userId === parsedUserInfo?.id);
  }

  function onCloseWishlistPopup() {
    setWishlistVis(false);
    getCurrentPostById();
  }

  async function onFollowClick() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    await onAuthorFollow(post?.authorId, !isUserAlreadyFollowing());
    const res = await getPostLikesNComments(post?.authorId, post?.id);
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

    await onPostAction({ postId: post?.id }, PostMethodEnum.POST_LIKE, isUserAlreadyLiked() ? 'put' : 'post');

    const res = await getPostLikesNComments(post?.authorId, post?.id);
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

  function onEditComplete() {
    editPostDetails({ postId: post?.id, title, content, desc });
    setContentEditable(false);
  }

  function onPostDelete() {
    deletePost(post?.id);
    navigate(AppRoutesEnum.HOMEPAGE);
  }

  function onEditClick() {
    setMoreAnchorEl(null);
    setContentEditable(true);
  }

  function onEditCancel() {
    setContentEditable(false);
    setContent(post?.content);
  }

  async function onSubmitComment(comment: string, parentCommentId?: number) {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }

    if (isPropEmpty(parentCommentId)) {
      await onPostAction({ postId: post?.id, comment }, PostMethodEnum.COMMENT, 'post');
    } else {
      await onPostAction({ parentCommentId, comment }, PostMethodEnum.REPLY, 'post');
    }

    const res = await getPostLikesNComments(post?.authorId, post?.id);
    setPost({ ...post, comments: res?.comments });
  }

  React.useEffect(() => {
    getCurrentPostById();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 flex flex-col items-center justify-center lg:w-[40%] md:w-[70%] s:w-full">
        <div className="w-full flex flex-col mt-20">
          <textarea
            className="fsr-30 font-ib mb-1 resize-none border-none outline-none bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={!isContentEditable}
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            readOnly={!isContentEditable}
            className="fsr-22 inter mb-3 resize-none border-none outline-none bg-transparent"
            style={{ color: '#6B6B6B' }}
          />

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
                <span className="mr-4">{calculateReadingTime(post?.content)} min read</span>
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
              <IconButton className="mr-6" onClick={() => setWishlistVis(true)}>
                {isUserAlreadyWishlisted() ? <BookmarkIcon style={{ width: 25 }} /> : <BookmarkBorderOutlinedIcon style={{ width: 25 }} />}
              </IconButton>

              {isAuthorIsVistor() && (
                <IconButton onClick={handleMoreClick}>
                  <MoreHorizOutlinedIcon style={{ width: 25 }} />
                </IconButton>
              )}
            </div>
          </div>
          <div className="w-full" style={{ height: 1, background: '#6B6B6B' }}></div>
        </div>

        <div className="w-full mt-5">
          <CustomQuill value={content} setValue={setContent} readonly={!isContentEditable} />
        </div>
      </div>

      <div className="absolute">
        <Comments data={post?.comments} open={commentVis} onSubmit={onSubmitComment} setOpen={setCommentVis} />
      </div>

      <Login open={openLogin} setOpen={setOpenLogin} />
      <Menu id="menu-appbar" anchorEl={moreAnchorEl} keepMounted open={Boolean(moreAnchorEl)} onClose={() => setMoreAnchorEl(null)}>
        <MenuItem onClick={onEditClick}>
          <span className="fsr-14 font-isb ml-3">Edit</span>
        </MenuItem>
        <MenuItem onClick={onPostDelete}>
          <span className="fsr-14 font-isb ml-3">Delete</span>
        </MenuItem>
      </Menu>

      {isContentEditable && (
        <div className="absolute top-20 right-10 flex gap-3">
          <Button onClick={onEditCancel} color="cancel" variant="contained">
            Cancel
          </Button>
          <Button onClick={onEditComplete} color="success" variant="contained">
            Done
          </Button>
        </div>
      )}

      {wishlistVis && <AddToCollections postId={post?.id} showWishlist={onCloseWishlistPopup} />}
    </div>
  );
};

export default SinglePost;
