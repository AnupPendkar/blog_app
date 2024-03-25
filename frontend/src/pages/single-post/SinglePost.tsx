import React from 'react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import postService from '@services/postService';
import Login from '@components/login/Login';
import Comments from '@pages/shared-comp/comments/Comments';
import CustomQuill from '@pages/shared-comp/CustomQull';
import usePostRequestUtility from '@hooks/usePostRequestUtility';
import AddToCollections from '@pages/shared-comp/AddToCollections';
import blankUser from '@assets/blank_user.svg';
import ViewProfileTooltip from '@pages/shared-comp/ViewProfileTooltip';
import useSharedEssentials from '@hooks/useSharedEssentials';
import { useNavigate, useParams } from 'react-router-dom';
import { constructDateTime, isPropEmpty } from '@shared/utilfunctions';
import { AppRoutesEnum } from '@shared/appRotues';
import { useAppSelector } from '@redux/store';
import { ISinglePost, PostMethodEnum } from '@models/post_model';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { MessageBoxCloseTypeEnum } from '@models/common';

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
  const defaultTitle = React.useRef('');
  const defaultDesc = React.useRef('');
  const { parsedUserInfo } = useAppSelector((state) => state?.user);
  const { userLoggedIn } = useAppSelector((state) => state.user);
  const { closeType, messageDialogDetails } = useAppSelector((state) => state.notification);
  const { onPostAction, getPostById, onAuthorFollow, editPostDetails, deletePost } = postService();
  const { calculateReadingTime, getPostLikesNComments } = usePostRequestUtility();
  const { askConfirmation } = useSharedEssentials();
  const { id } = useParams();
  const navigate = useNavigate();

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
    defaultTitle.current = res?.post?.title;
    defaultDesc.current = res?.post?.desc;
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

  function askDeleteConfirmation() {
    askConfirmation('Do you really want to delete this post?', MessageBoxCloseTypeEnum.CONFIRM_DELETE_POST);
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
    defaultDesc.current = post?.desc;
    defaultTitle.current = title;
    setContentEditable(false);
    setContent(post?.content);
    setTitle(post?.title);
    setDesc(post?.desc);
  }

  async function shouldFetchAPI() {
    await getCurrentPostById();
  }

  function handleWishlistClk() {
    if (!userLoggedIn) {
      setOpenLogin(true);
      return;
    }
    setWishlistVis(true);
  }

  React.useEffect(() => {
    if (isPropEmpty(messageDialogDetails)) {
      return;
    }

    switch (closeType) {
      case MessageBoxCloseTypeEnum.CONFIRM_DELETE_POST:
        onPostDelete();
        break;
    }
  }, [closeType]);

  React.useEffect(() => {
    getCurrentPostById();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mb-5 flex flex-col items-center justify-center lg:w-[40%] md:w-[70%] sm:w-[90%] w-[90%]">
        <div className="w-full flex flex-col mt-3 sm:mt-20 px-3">
          <span className="fsr-30 font-ib mb-1 outline-none" role="textbox" onInput={(e: any) => setTitle(e.target.outerText)} contentEditable={isContentEditable}>
            {defaultTitle.current}
          </span>

          <span
            className="fsr-22 inter mb-3 outline-none"
            style={{ color: '#6B6B6B' }}
            role="textbox"
            onInput={(e: any) => setDesc(e.target.outerText)}
            contentEditable={isContentEditable}
          >
            {defaultDesc.current}
          </span>

          <div className="user flex items-center">
            <img
              onClick={() => navigate(`${AppRoutesEnum.PROFILE}/${post?.authorId}`)}
              className="w-16 h-16 mr-6 cursor-pointer"
              style={{ borderRadius: '50%' }}
              src={!isPropEmpty(post?.author?.profileImg) ? post?.author?.profileImg : blankUser}
              alt=""
            />
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
          {/* <ViewProfileTooltip/> */}

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
              <IconButton className="mr-6" onClick={handleWishlistClk}>
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
        <Comments data={post} open={commentVis} closeComments={setCommentVis} shouldFetchAPI={shouldFetchAPI} />
      </div>

      <Login open={openLogin} setOpen={setOpenLogin} />
      <Menu id="menu-appbar" anchorEl={moreAnchorEl} keepMounted open={Boolean(moreAnchorEl)} onClose={() => setMoreAnchorEl(null)}>
        <MenuItem onClick={onEditClick}>
          <span className="fsr-14 font-isb ml-3">Edit</span>
        </MenuItem>
        <MenuItem onClick={askDeleteConfirmation}>
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
