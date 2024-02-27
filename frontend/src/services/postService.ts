import useHttp from '@hooks/useHttp';
import useSharedEssentials from '@hooks/useSharedEssentials';
import { IComment, IFollower, ILike, IPostDetails, IPublishPost } from '@models/post_model';
import React from 'react';

const postService = () => {
  const http = useHttp();
  const { handleErr } = useSharedEssentials();

  function publishPost(title: string, content: string, desc: string, thumbnailImg: string): Promise<number> {
    const body = {
      title,
      content,
      desc,
      thumbnailImg,
    };

    return new Promise(async (resolve) => {
      const res = await http.request('post', '/create-post', '', body);

      if (res?.status === 200) {
        resolve(res?.data?.id);
      } else {
        handleErr(res);
      }
    });
  }

  function fetchLikesNCommentsByPostId(authorId: number, id: number): Promise<{ likes: ILike[]; comments: IComment[]; followers: IFollower[] }> {
    const params = { postId: id, authorId };

    return new Promise(async (resolve) => {
      const res = await http.noLoader().request('get', '/get-post-likes-comments', params);

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function getUserPosts(): Promise<IPostDetails[]> {
    return new Promise(async (resolve) => {
      const res = await http.request('get', '/get-posts');

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function getAllPosts(): Promise<any> {
    return new Promise(async (resolve) => {
      const res = await http.request('get', '/get-all-posts');

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function getPostById(postId: number): Promise<any> {
    const params = { postId: postId };

    return new Promise(async (resolve) => {
      const res = await http.request('get', '/get-post-by-id', params);

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function postLike(postId: number, add = true): Promise<void> {
    const body = { postId: postId, add };

    return new Promise(async (resolve) => {
      const res = await http.noLoader().request('post', '/post-like', '', body);

      if ([200, 201, 204]?.includes(res?.status)) {
        resolve();
      } else {
        handleErr(res);
      }
    });
  }

  function onAuthorFollow(authorId: number, add = true): Promise<void> {
    const body = { authorId: authorId, add };

    return new Promise(async (resolve) => {
      const res = await http.noLoader().request('post', '/follow-author', '', body);

      if ([200, 201, 204]?.includes(res?.status)) {
        resolve();
      } else {
        handleErr(res);
      }
    });
  }

  function onPostComment(postId: number, comment: string): Promise<any> {
    const body = {
      postId,
      comment,
    };

    return new Promise(async (resolve) => {
      const res = await http.noLoader().request('post', '/post-comment', '', body);

      if ([200, 201, 204]?.includes(res?.status)) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function onPostCommentReply(parentCommentId: number, comment: string): Promise<any> {
    const body = {
      parentCommentId,
      comment,
    };

    return new Promise(async (resolve) => {
      const res = await http.noLoader().request('post', '/post-reply', '', body);

      if ([200, 201, 204]?.includes(res?.status)) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  return { publishPost, getUserPosts, getAllPosts, getPostById, postLike, onPostComment, onPostCommentReply, fetchLikesNCommentsByPostId, onAuthorFollow };
};

export default postService;
