import { eq } from 'drizzle-orm';
import { db } from '../config';
import { Request, Response, NextFunction } from 'express';
import { isPropEmpty } from '../utils/utils';
import { users } from '../schema/userSchema';
import { checkUserExists, checkUsernameExists, getUserDetailsByName } from './userControllers';
import { categories, comments, likes, posts, postsToCategories } from '../schema/postSchema';

export async function allPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const allPosts = await db.query.users.findMany({
      columns: {
        fullName: true,
        phoneNo: true,
      },
      with: {
        posts: {
          columns: {
            id: true,
            // categories: true,
            title: true,
            content: true,
          },
        },
      },
    });
    res.send(allPosts);
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
            comments: true,
          },
        },
        followers: {
          with: {
            following: {
              with: {
                follower: true,
                following: true,
              },
            },
          },
        },
      },
    });


    res
      .status(200)
      .json({ likes: likesNCommentNFollwers?.posts?.[0]?.likes, comments: likesNCommentNFollwers?.posts?.[0]?.comments, followers: likesNCommentNFollwers?.followers, likesNCommentNFollwers });
  } catch (err) {
    next(err);
  }
}

export async function onPostComment(req, res: Response, next: NextFunction) {
  try {
    const { postId, comment } = req.body;
    const userId = req.user.userId;

    console.log(postId, userId, comment);

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
      with: { categories: true, comments: true, likes: true, author: { with: { followers: true } } },
      where: (posts, { eq }) => eq(posts?.id, +postId),
    });

    res.json({ post });
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
