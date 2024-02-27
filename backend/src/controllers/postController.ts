import { eq } from 'drizzle-orm';
import { db } from '../config';
import { Request, Response, NextFunction } from 'express';
import { isPropEmpty } from '../utils/utils';
import { users } from '../schema/userSchema';
import { checkUserExists, checkUsernameExists, getUserDetailsByName } from './userControllers';
import { categories, comments, likes, posts, postsToCategories, replies } from '../schema/postSchema';

export async function allPosts(req: Request, res: Response, next: NextFunction) {
  // try {
  //   const allPosts = await db.query.users.findMany({
  //     columns: {
  //       fullName: true,
  //       phoneNo: true,
  //     },
  //     with: {
  //       posts: {
  //         columns: {
  //           id: true,
  //           // categories: true,
  //           title: true,
  //           content: true,
  //         },
  //       },
  //     },
  //   });
  //   res.send(allPosts);
  // } catch (err) {
  //   next(err);
  // }
  try {
    const posts = await db.query.posts.findMany({
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
        categories: {
          columns: {},

          with: {
            category: true,
          },
        },
      },
    });

    posts?.forEach((post) => {
      (post as any).categories = post?.categories?.map((cat) => cat?.category);
    });

    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function userPosts(req, res: Response, next: NextFunction) {
  try {
    const postData = await db.query.users.findFirst({
      columns: {},
      where: (users, { eq }) => eq(req.user.username as any, users?.username),
      with: {
        posts: {
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
            categories: {
              columns: {},

              with: {
                category: true,
              },
            },
          },
        },
      },
    });

    postData?.posts?.forEach((post) => {
      (post as any).categories = post?.categories?.map((cat) => cat?.category);
    });

    res.json(postData?.posts);
  } catch (err) {
    next(err);
  }
}

export async function onPostLike(req, res: Response, next: NextFunction) {
  try {
    const { postId, add } = req.body;
    const userId = req.user.userId;

    if (add) {
      await db.insert(likes).values({
        postId,
        userId,
      });
      res.status(200).json('Post liked successfully');
    } else {
      await db.delete(likes).where(eq(likes?.userId, userId));
      res.status(200).json('Post liked removed successfully');
    }
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

export async function onPostComment(req, res: Response, next: NextFunction) {
  try {
    const { postId, comment } = req.body;
    const userId = req.user.userId;

    await db.insert(comments).values({
      postId,
      userId,
      comment,
    });

    res.status(200).json('Commented successfully');
  } catch (err) {
    next(err);
  }
}

export async function onPostCommentReply(req, res: Response, next: NextFunction) {
  try {
    const { comment, parentCommentId } = req.body;
    const userId = req.user.userId;

    await db.insert(replies).values({
      parentCommentId,
      comment,
      userId,
    });

    res.status(200).json('Commented successfully');
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

export async function getPostById(req, res: Response, next: NextFunction) {
  try {
    const { postId } = req.query;

    const post = await db.query.posts.findFirst({
      with: {
        categories: true,
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
              },
            },
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
    const { postId, title, content } = req.body;
    const updatedPost = await db.update(posts).set({ content, title }).where(eq(posts?.id, postId));

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
