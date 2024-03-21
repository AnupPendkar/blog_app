import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { commentLikes, comments, likes, posts, replies, replyLikes } from './postSchema';
import { relations } from 'drizzle-orm';

// <-----------------------------------User Model--------------------------------------->
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  profileImg: varchar('profile_img'),
  username: varchar('username', { length: 100 }).unique(),
  email: varchar('email', { length: 100 }).unique(),
  password: varchar('password', { length: 256 }).notNull(),
  phoneNo: varchar('phoneNo', { length: 20 }).notNull().unique(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  about: one(about),
  followers: many(followersToAuthors),
  replies: many(replies),
  posts: many(posts),
  likes: many(likes),
  replylikes: many(replyLikes),
  commentLikes: many(commentLikes),
  comments: many(comments),
  collections: many(collections),
}));
// <--------------------------------------------------------------------------------------->

export const otpDetails = pgTable('otp_details', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  email: varchar('email', { length: 100 }),
  otp: varchar('otp', {length: 10}),

});

export const about = pgTable('about', {
  id: serial('id').primaryKey(),
  desc: text('desc'),
  profession: varchar('profession', { length: 100 }),
  userId: integer('user_id').references(() => users?.id, { onDelete: 'cascade' }),
});

export const aboutRelations = relations(about, ({ one }) => ({
  user: one(users, {
    fields: [about?.userId],
    references: [users?.id],
  }),
}));

export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  userId: integer('user_id').references(() => users?.id, { onDelete: 'cascade' }),
});

export const collectionRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections?.userId],
    references: [users?.id],
  }),
  post: many(collectionToPosts),
}));

export const collectionToPosts = pgTable(
  'collections_to_posts',
  {
    collectionId: integer('collection_id').references(() => collections?.id, { onDelete: 'cascade' }),
    postId: integer('post_id').references(() => posts?.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey(t.collectionId, t.postId),
  })
);

export const collectionToPostRelations = relations(collectionToPosts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionToPosts?.collectionId],
    references: [collections?.id],
  }),
  post: one(posts, {
    fields: [collectionToPosts?.postId],
    references: [posts?.id],
  }),
}));

// <-----------------------------------Follower Model-------------------------------------->
export const followers = pgTable('followers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
});

export const followerRelations = relations(followers, ({ many }) => ({
  following: many(followersToAuthors),
}));
// <--------------------------------------------------------------------------------------->

// <-----------------------------followersToAuthors Model---------------------------------->
export const followersToAuthors = pgTable(
  'followers_to_authors',
  {
    authorId: integer('author_id').references(() => users?.id, { onDelete: 'cascade' }),
    followId: integer('follow_id').references(() => followers?.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey(t.authorId, t.followId),
  })
);

export const followerToAuthorRelations = relations(followersToAuthors, ({ one }) => ({
  follower: one(followers, {
    fields: [followersToAuthors?.followId],
    references: [followers?.id],
  }),

  user: one(users, {
    fields: [followersToAuthors?.authorId],
    references: [users?.id],
  }),
}));

export type NewUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
