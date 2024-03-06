import useHttp from '@hooks/useHttp';
import useSharedEssentials from '@hooks/useSharedEssentials';
import { IComment, IFollower, ILike, IPostDetails, IPublishPost, PostMethodEnum } from '@models/post_model';
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

  function onPostAction(data, method: PostMethodEnum, reqMethod: string) {
    return new Promise(async (resolve) => {
      const body = {
        data,
        method,
      };

      const res = await http.noLoader().request(reqMethod, '/on-post-action', '', body);

      if ([200, 201, 204]?.includes(res?.status)) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function editPostDetails(reqBody: { postId: number; title: string; desc: string; content: string }): Promise<void> {
    return new Promise(async (resolve) => {
      const res = await http.request('put', '/update-post', '', reqBody);

      if (res?.status === 200) {
        resolve();
      } else {
        handleErr(res);
      }
    });
  }

  function deletePost(id: number): Promise<void> {
    return new Promise(async (resolve) => {
      const res = await http.request('delete', '/delete-post', '', { postId: id });

      if (res?.status === 200) {
        resolve();
      } else {
        handleErr(res);
      }
    });
  }

  function addPostToCollection(reqBody: { postId: number; collectionIdList: number[] }): Promise<void> {
    return new Promise(async (resolve) => {
      const res = await http.request('post', '/add-post-to-collection', '', reqBody);

      if (res?.status === 200) {
        resolve();
      } else {
        handleErr(res);
      }
    });
  }

  function fetchPostComments(postId: number) {
    return new Promise(async (resolve) => {
      const res = await http.request('get', '/get-post-comments', { postId });

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  return {
    publishPost,
    getUserPosts,
    getAllPosts,
    getPostById,
    onPostAction,
    fetchLikesNCommentsByPostId,
    onAuthorFollow,
    editPostDetails,
    deletePost,
    addPostToCollection,
    fetchPostComments,
  };
};

export default postService;
