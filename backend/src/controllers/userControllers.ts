import { eq } from 'drizzle-orm';
import { db } from '../config';
import { Request, Response, NextFunction } from 'express';
import { isPropEmpty } from '../utils/utils';
import { about, collections, followers, followersToAuthors, otpDetails, users } from '../schema/userSchema';
import jwt from 'jsonwebtoken';
import emailSender from '../config/mailSender';
import 'dotenv/config';

export async function userLogin(req, res: Response, next: NextFunction) {
  try {
    const { email, password, social } = req.body;

    if (social) {
    }

    const [foundUsr, ...rest] = await db.select().from(users).where(eq(users.email, email));

    if (!foundUsr) {
      res.status(403).json({ message: 'Invalid users credentials' });
      return;
    }

    const isPasswordValid = password === foundUsr.password;

    if (isPasswordValid) {
      const access = jwt.sign({ username: foundUsr.username, userId: foundUsr.id }, process.env.SECRET_KEY, {
        expiresIn: '2d',
      });

      const refresh = jwt.sign({ username: foundUsr.username, userId: foundUsr.id }, process.env.SECRET_KEY, {
        expiresIn: '2d',
      });

      res.json({ access, refresh });
    } else {
      res.status(403).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    next(error);
  }
}

export async function generateOtp(req, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const [user, ...rest] = await checkEmailExits(email);
    if (!user) {
      res.status(422).send('User not registered.');
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000) + '';
    await db.insert(otpDetails).values({ email, otp });

    const _emailSender = await emailSender(
      email,
      'Verification Email',
      `<h1>Please confirm your OTP</h1>
    <p>Here is your OTP code: ${otp}</p>`
    );

    res.status(200).send('OTP successfully generated!');
  } catch (err) {
    next(err);
  }
}

export async function userLogout(req, res: Response, next: NextFunction) {
  try {
    req.logout();
    // res.redirect(CLIENT_URL);
    res.status(200).json('Successfully logged out!');
  } catch (err) {
    next(err);
  }
}

export async function checkUserExists(userId) {
  return await db.select({ username: users.username, id: users.id }).from(users).where(eq(userId, users.id));
}

export async function getUserDetailsByName(username) {
  const [user, ...rest] = await db.select().from(users).where(eq(username, users?.username));
  return user;
}

export async function checkUsernameExists(username) {
  return await db.select({ username: users.username, id: users.id }).from(users).where(eq(username, users.username));
}

export async function checkEmailExits(email) {
  return await db.select({ email: users.email }).from(users).where(eq(email, users.email));
}

export async function userRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, name, email, mobileNo, profileImg } = req.body;

    if (!isPropEmpty(await checkUsernameExists(username))) {
      res.status(422).json({ message: 'Username already taken!' });
      return;
    }

    if (!isPropEmpty(await checkEmailExits(email))) {
      res.status(422).json({ message: 'Entered email already registered!' });
      return;
    }

    const [newUser, ...rest] = await db.insert(users).values({ username, password, fullName: name, email, phoneNo: mobileNo, profileImg }).returning({
      userId: users?.id,
      name: users?.fullName,
      email: users?.email,
    });
    if (newUser) {
      res.json({ message: 'Registered successfully', newUser });
    }
  } catch (err) {
    next(err);
  }
}

export async function updateUsername(req: Request, res: Response, next: NextFunction) {
  try {
    const { curr_username, updated_username } = req.body;
    const [curr_user, ...rest] = await checkUsernameExists(curr_username);
    if (isPropEmpty(curr_user)) {
      res.status(422).json({ message: 'Requested username not found' });
      return;
    }

    const [updated_user, ...restt] = await checkUsernameExists(updated_username);
    if (!isPropEmpty(updated_user)) {
      res.status(422).json({ message: 'Username already taken!!' });
      return;
    }

    const updatedUser = await db.update(users).set({ username: updated_username }).where(eq(curr_username, users.username));
    if (updatedUser) {
      res.json({ message: 'Username updated succesfully!!!' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body;
    const [deletedUsr, ...rest] = await checkUserExists(userId);
    if (isPropEmpty(deletedUsr)) {
      res.status(422).json({ message: 'Requested username not found' });
      return;
    }

    const deletedUser = await db.delete(users).where(eq(userId, users?.id));
    if (deletedUser) {
      res.json('User Deleted succesfully!!!');
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

export async function onAuthorFollow(req, res: Response, next: NextFunction) {
  try {
    const { authorId, add } = req.body;
    const userId = req.user.userId;

    if (add) {
      const [newFollower, ...rest] = await db.insert(followers).values({ userId }).returning({ id: followers?.id });
      await db.insert(followersToAuthors).values({ followId: newFollower?.id, authorId: authorId });

      res.status(200).json('Followed successfully');
    } else {
      const [follower, ...restFollower] = await db.select().from(followers).where(eq(followers?.userId, userId));

      await db.delete(followersToAuthors).where(eq(followersToAuthors?.followId, userId) && eq(followersToAuthors?.authorId, authorId));

      res.status(200).json('Unfollowed successfully');
    }
  } catch (err) {
    next(err);
  }
}

export async function createCollection(req, res: Response, next: NextFunction) {
  try {
    const { collectionName } = req.body;
    const userId = req.user.userId;

    const [collection, ...rest] = await db.insert(collections).values({ name: collectionName, userId }).returning({ id: collections?.id });

    res.status(200).json({ id: collection?.id });
  } catch (err) {
    next(err);
  }
}

export async function deleteCollection(req, res: Response, next: NextFunction) {
  try {
    const { id } = req.body;

    await db.delete(collections).where(eq(collections?.id, id));
    res.status(200).json('collection deleted!');
  } catch (err) {
    next(err);
  }
}

export async function getUserCollections(req, res: Response, next: NextFunction) {
  try {
    const userId = req.user.userId;
    const { postId } = req.query;

    const data = await db.query.collections.findMany({
      where: (collections, { eq }) => eq(collections?.userId, userId),
      with: {
        post: true,
      },
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function userInfo(req, res: Response, next: NextFunction) {
  try {
    const userId = req.user.userId;

    const _userInfo = await db.select().from(users).where(eq(users?.id, userId));

    res.status(200).json(_userInfo);
  } catch (err) {
    next(err);
  }
}

export async function userDetails(req, res: Response, next: NextFunction) {
  try {
    const { id } = req.query;

    const userData = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users?.id, id),
      columns: {
        email: true,
        fullName: true,
        username: true,
        profileImg: true,
      },
      with: {
        followers: {
          with: {
            follower: true,
          },
        },
        posts: {
          limit: 15,
        },
        collections: {
          with: {
            post: {
              with: {
                post: true,
              },
            },
          },
        },
        about: true,
      },
    });

    userData?.collections?.forEach((coll) => {
      coll = Object.assign(coll, {
        post: coll?.post?.reduce((prev, curr) => prev.concat(curr?.post), []),
        total: coll?.post?.length,
      });
    });

    res.status(200).json({ ...userData });
  } catch (err) {
    next(err);
  }
}

export async function updateProfileInfo(req, res: Response, next: NextFunction) {
  try {
    const { profileImg, username, name } = req.query;
    const userId = req.user.userId;

    await db.update(users).set({ profileImg, username, fullName: name }).where(eq(users?.id, userId));
    res.status(200).json('update successfull');
  } catch (err) {
    next(err);
  }
}

export async function setAboutDetails(req, res: Response, next: NextFunction) {
  try {
    const { desc } = req.body;
    const userId = req.user.userId;

    await db.insert(about).values({ desc, userId });
    res.status(200).json('updated successfull');
  } catch (err) {
    next(err);
  }
}

export async function updateAboutDetails(req, res: Response, next: NextFunction) {
  try {
    const { desc } = req.body;
    const userId = req.user.userId;
    console.log(desc);

    await db.update(about).set({ desc }).where(eq(about?.userId, userId));
    res.status(200).json('Update successfull!');
  } catch (err) {
    next(err);
  }
}
