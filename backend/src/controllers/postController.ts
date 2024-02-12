import { eq } from 'drizzle-orm';
import { db } from '../config';
import { Request, Response, NextFunction } from 'express';
import { isPropEmpty } from '../utils/utils';
import { users } from '../schema/userSchema';
import { checkUsernameExits } from './userControllers';
import { categories, posts, postsToCategories } from '../schema/postSchema';

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
    // console.log(allPosts);
  } catch (err) {
    next(err);
  }
}

export async function userPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.query;
    const user = await checkUsernameExits(username);
    if (isPropEmpty(user)) {
      res.status(422).json({ message: 'Username not present!' });
      return;
    }

    const postData = await db.query.users.findFirst({
      columns: {},
      where: (users, { eq }) => eq(user?.[0]?.id as any, users?.id),
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

    // const [usrData, ...restUsrData] = await db.select().from(users).where(eq(users?.id, user[0]?.id));
    // const postData = await db.select().from(posts).where(eq(posts?.authorId, user[0]?.id));

    // const postsAndCategories = postData.map(async (post) => {
    //   const postToCatRes = await db.select().from(postsToCategories).where(eq(postsToCategories?.postId, post?.id));
    //   const categoryPromise = postToCatRes.map(async (postToCat) => {
    //     const [categoryRes, ...rest] = await db
    //       .select()
    //       .from(categories)
    //       .where(eq(postToCat?.catId as any, categories?.id));
    //     return categoryRes;
    //   });

    //   const categoryData = await Promise.all(categoryPromise);

    //   return {
    //     ...post,
    //     category: categoryData,
    //   };
    // });

    // const postAndCategoriesData = await Promise.all(postsAndCategories);

    // res.json({
    //   ...usrData,
    //   posts: postAndCategoriesData,
    // });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, title, content, categories } = req.body;
    const user = await checkUsernameExits(username);
    if (isPropEmpty(user)) {
      res.status(422).json({ message: 'Username not present!' });
      return;
    }

    const [newPost, ...newPostRest] = await db
      .insert(posts)
      .values({
        authorId: user?.[0]?.id,
        title,
        content,
      })
      .returning({ id: posts?.id });

    const newPostCategories = (categories as Array<number>).map(async (category) => {
      const addCatToNewPost = await db.insert(postsToCategories).values({
        catId: category,
        postId: newPost?.id,
      });
    });

    await Promise.all(newPostCategories);
    res.json({ message: 'New post has been added' });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, postId, title, content } = req.body;
    const user = await checkUsernameExits(username);
    if (isPropEmpty(user)) {
      res.status(422).json({ message: 'Username not present!' });
      return;
    }

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
    const { username, postId } = req.body;
    const user = await checkUsernameExits(username);
    if (isPropEmpty(user)) {
      res.status(422).json({ message: 'Username not present!' });
      return;
    }

    const deletedPost = await db.delete(posts).where(eq(posts?.id, postId));

    if (deletedPost) {
      res.json({ message: 'Post has been deleted successfully!' });
    }
  } catch (err) {
    next(err);
  }
}
