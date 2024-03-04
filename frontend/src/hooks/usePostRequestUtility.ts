import { ILike, IComment, IFollower } from '@models/post_model';
import postService from '@services/postService';
import React from 'react';

const usePostRequestUtility = () => {
  const { fetchLikesNCommentsByPostId } = postService();

  function calculateReadingTime(text: string) {
    const wordCount = text?.split(/\s+/)?.length;
    const readingTime = wordCount / 230;
    return Math.round(readingTime);
  }

  function getPostLikesNComments(
    authorId: number,
    id: number
  ): Promise<{
    likes: ILike[];
    comments: IComment[];
    followers: IFollower[];
  }> {
    return new Promise(async (resolve) => {
      const res = await fetchLikesNCommentsByPostId(authorId, id);
      resolve(res);
    });
  }

  return { calculateReadingTime, getPostLikesNComments };
};

export default usePostRequestUtility;
