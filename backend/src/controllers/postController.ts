import { eq, inArray } from 'drizzle-orm';
import { db } from '../config';
import { Request, Response, NextFunction } from 'express';
import { collectionToPosts, users } from '../schema/userSchema';
import { checkUserExists, checkUsernameExists, getUserDetailsByName } from './userControllers';
import { categories, commentLikes, comments, likes, posts, postsToCategories, replies, replyLikes } from '../schema/postSchema';
import { PostMethodEnum } from '../models/common';
import { isPropEmpty } from '../utils/utils';

export async function allPosts(req, res: Response, next: NextFunction) {
  let { ids, page_no, page_size } = req.query;
  if (ids?.length > 0) {
    ids = JSON.parse(ids);
  }

  try {
    const _posts = await db.query.posts.findMany({
      // limit: page_size, // the number of rows to return
      // offset: (page_no - 1) * page_size, // the number of rows to skip
      columns: {
        id: true,
        title: true,
        content: true,
        thumbnailImg: true,
        createdAt: true,
        authorId: true,
        desc: true,
      },

      with: {
        author: {
          columns: {
            fullName: true,
          },
        },
        likes: true,
        comments: true,
        categories: {
          columns: {},

          with: {
            category: true,
          },
        },
      },
    });

    _posts?.forEach((post) => {
      (post as any).categories = post?.categories?.map((cat) => cat?.category);
    });

    let modifiedPosts = _posts;
    if (ids?.length > 0) {
      modifiedPosts = _posts?.filter((post) => {
        const b = post?.categories?.filter((cat: any) => ids?.includes(cat?.id));
        return b.length > 0;
      });
    }

    modifiedPosts = modifiedPosts?.sort((a, b) => {
      return b?.likes?.length + b?.comments?.length - (a?.likes?.length + a?.comments?.length);
    });

    const totalRecords = modifiedPosts?.length;
    const filteredPosts = modifiedPosts?.slice((page_no - 1) * page_size, page_no * page_size > totalRecords ? totalRecords : page_size);

    res.json({ count: totalRecords, posts: filteredPosts });
  } catch (err) {
    next(err);
  }
}

export async function fetchFeaturedPosts(req, res: Response, next: NextFunction) {
  let { editors_pick } = req.query;

  try {
    const _posts = await db.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts?.createdAt),
      where: (posts) => (editors_pick ? inArray(posts?.id, [1, 2, 3]) : undefined),
      columns: {
        id: true,
        title: true,
        content: true,
        thumbnailImg: true,
        createdAt: true,
        authorId: true,
        desc: true,
      },
      with: {
        author: {
          columns: {
            fullName: true,
          },
        },
        categories: {
          columns: {},
          with: {
            category: true,
          },
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function userPosts(req, res: Response, next: NextFunction) {
  try {
    let { ids, page_no, page_size } = req.query;
    if (ids?.length > 0) {
      ids = JSON.parse(ids);
    }

    const _posts = await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts?.authorId, req.user.userId),
      orderBy: (posts, { desc }) => desc(posts?.createdAt),
      // limit: page_size, // the number of rows to return
      // offset: (page_no - 1) * page_size, // the number of rows to skip
      columns: {
        id: true,
        title: true,
        content: true,
        thumbnailImg: true,
        createdAt: true,
        authorId: true,
        desc: true,
      },
      with: {
        author: {
          columns: {
            fullName: true,
          },
        },
        categories: {
          columns: {},

          with: {
            category: true,
          },
        },
      },
    });

    _posts?.forEach((post) => {
      (post as any).categories = post?.categories?.map((cat) => cat?.category);
    });

    let modifiedPosts = _posts;
    if (ids?.length > 0) {
      modifiedPosts = _posts?.filter((post) => {
        const b = post?.categories?.filter((cat: any) => ids?.includes(cat?.id));
        return b.length > 0;
      });
    }

    const totalRecords = modifiedPosts?.length;
    const filteredPosts = modifiedPosts?.slice((page_no - 1) * page_size, page_no * page_size > totalRecords ? totalRecords : page_size);

    res.json({ count: totalRecords, posts: filteredPosts });
  } catch (err) {
    next(err);
  }
}

export async function totalLikesNComment(req, res: Response, next: NextFunction) {
  const { authorId, postId } = req.query;

  try {
    const likesNCommentNFollwers = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users?.id, authorId),
      with: {
        posts: {
          where: (posts, { eq }) => eq(posts?.id, postId),
          with: {
            likes: true,
            comments: {
              with: {
                user: {
                  columns: {
                    id: true,
                    profileImg: true,
                    username: true,
                    email: true,
                  },
                },
                replies: {
                  with: {
                    user: {
                      columns: {
                        id: true,
                        profileImg: true,
                        username: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        followers: {
          with: {
            follower: {
              columns: {
                userId: true,
              },
            },
          },
        },
      },
    });

    likesNCommentNFollwers?.followers?.forEach((foll) => {
      Object.assign(foll, {
        follower: foll?.follower?.userId,
      });
    });

    likesNCommentNFollwers?.posts?.[0]?.comments?.forEach((comm) => {
      Object.assign(comm, {
        profileImg: comm?.user?.profileImg,
        username: comm?.user?.username,
        email: comm?.user?.email,
        user: undefined,
      });

      comm?.replies?.forEach((rep) => {
        Object.assign(rep, {
          profileImg: rep?.user?.profileImg,
          username: rep?.user?.username,
          email: rep?.user?.email,
          user: undefined,
        });
      });
    });

    res.status(200).json({
      likes: likesNCommentNFollwers?.posts?.[0]?.likes,
      comments: likesNCommentNFollwers?.posts?.[0]?.comments,
      followers: likesNCommentNFollwers?.followers,
      likesNCommentNFollwers,
    });
  } catch (err) {
    next(err);
  }
}

export async function onPostAction(req, res: Response, next: NextFunction) {
  try {
    const { data, method } = req.body;
    const userId = req.user.userId;

    switch (method) {
      case PostMethodEnum.POST_LIKE:
        if (req.method === 'POST') {
          await db.insert(likes).values({
            postId: data?.postId,
            userId,
          });
        } else if (req.method === 'PUT') {
          await db.delete(likes).where(eq(likes?.userId, userId));
        }
        break;

      case PostMethodEnum.COMMENT:
        if (req.method === 'POST') {
          await db.insert(comments).values({
            postId: data?.postId,
            comment: data?.comment,
            userId,
          });
        } else if (req.method === 'PUT') {
          await db.update(comments).set({ comment: data?.comment }).where(eq(comments?.id, data?.commentId));
        } else {
          await db.delete(comments).where(eq(comments?.id, data?.commentId));
        }
        break;

      case PostMethodEnum.COMMENT_LIKE:
        if (req.method === 'POST') {
          await db.insert(commentLikes).values({
            commentId: data?.commentId,
            userId,
          });
        } else if (req.method === 'PUT') {
          await db.delete(commentLikes).where(eq(commentLikes?.id, data?.commentId) && eq(commentLikes?.userId, userId));
        }
        break;

      case PostMethodEnum.REPLY:
        if (req.method === 'POST') {
          await db.insert(replies).values({
            parentCommentId: data?.parentCommentId,
            comment: data?.comment,
            userId,
          });
        } else if (req.method === 'PUT') {
          await db.update(replies).set({ comment: data?.reply }).where(eq(replies?.id, data?.replyId));
        } else {
          await db.delete(replies).where(eq(replies?.id, data?.replyId));
        }

        break;

      case PostMethodEnum.REPLY_LIKE:
        if (req.method === 'POST') {
          await db.insert(replyLikes).values({
            replyId: data?.replyId,
            userId,
          });
        } else if (req.method === 'PUT') {
          await db.delete(replyLikes).where(eq(replyLikes?.id, data?.replyId) && eq(replyLikes?.userId, userId));
        }

        break;
    }

    res.status(200).json('successfull');
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res: Response, next: NextFunction) {
  try {
    const { title, content, desc, thumbnailImg, categories } = req.body;
    const userId = req.user.userId;

    const [newPost, ...newPostRest] = await db
      .insert(posts)
      .values({
        authorId: userId,
        title,
        content,
        desc,
        thumbnailImg,
      })
      .returning({ id: posts?.id });

    if (categories !== undefined) {
      const newPostCategories = (categories as Array<number>)?.map(async (category) => {
        const addCatToNewPost = await db.insert(postsToCategories).values({
          catId: category,
          postId: newPost?.id,
        });
      });

      await Promise.all(newPostCategories);
    }
    res.json({ message: 'New post has been added', id: newPost?.id });
  } catch (err) {
    next(err);
  }
}

export async function postComments(req, res: Response, next: NextFunction) {
  try {
    const { postId } = req.query;

    const comments = await db.query.comments.findMany({
      where: (comments, { eq }) => eq(comments?.postId, postId),
      with: {
        replies: true,
        likes: true,
      },
    });

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}

export async function getPostById(req, res: Response, next: NextFunction) {
  try {
    const { postId } = req.query;

    const post = await db.query.posts.findFirst({
      with: {
        categories: true,
        collections: {
          with: {
            collection: true,
          },
        },
        comments: {
          with: {
            user: {
              columns: {
                username: true,
                email: true,
                profileImg: true,
              },
            },
            replies: {
              with: {
                user: {
                  columns: {
                    id: true,
                    profileImg: true,
                    username: true,
                    email: true,
                  },
                },
                likes: true,
              },
            },
            likes: true,
          },
        },
        likes: true,
        author: {
          with: {
            followers: {
              with: {
                follower: {
                  columns: {
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
      where: (posts, { eq }) => eq(posts?.id, +postId),
    });

    const resData = post;
    resData?.author?.followers?.forEach((foll) =>
      Object.assign(foll, {
        follower: foll?.follower?.userId,
      })
    );

    resData?.comments?.forEach((comm) => {
      Object.assign(comm, {
        profileImg: comm?.user?.profileImg,
        username: comm?.user?.username,
        email: comm?.user?.email,
        user: undefined,
      });

      comm?.replies?.forEach((rep) => {
        Object.assign(rep, {
          profileImg: rep?.user?.profileImg,
          username: rep?.user?.username,
          email: rep?.user?.email,
          user: undefined,
        });
      });
    });

    res.json({ post: resData });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId, title, content, desc } = req.body;
    const updatedPost = await db.update(posts).set({ content, title, desc }).where(eq(posts?.id, postId));

    if (updatedPost) {
      res.json({ message: 'Post has been updated!' });
    }
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId } = req.body;
    const deletedPost = await db.delete(posts).where(eq(posts?.id, postId));

    if (deletedPost) {
      res.json({ message: 'Post has been deleted successfully!' });
    }
  } catch (err) {
    next(err);
  }
}

export async function addPostToCollection(req, res: Response, next: NextFunction) {
  try {
    const { collectionIdList, postId } = req.body;

    await db.delete(collectionToPosts).where(eq(collectionToPosts?.postId, postId));

    collectionIdList?.forEach(async (collId: number) => {
      await db.insert(collectionToPosts).values({ postId, collectionId: collId });
    });

    res.json('Post has been added successfully');
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req, res: Response, next: NextFunction) {
  try {
    const categoryList = await db.select().from(categories);

    res.status(200).json(categoryList);
  } catch (err) {
    next(err);
  }
}
