import { integer, pgTable, primaryKey, serial, text, varchar } from 'drizzle-orm/pg-core';
import { comments, likes, posts } from './postSchema';
import { relations } from 'drizzle-orm';

// <-----------------------------------User Model--------------------------------------->
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  profileImg: varchar('profile_img'),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 100 }).unique(),
  password: varchar('password', { length: 256 }).notNull(),
  phoneNo: varchar('phoneNo', { length: 20 }).notNull().unique(),
});

export const userRelations = relations(users, ({ many }) => ({
  followers: many(followersToAuthors),
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
}));
// <--------------------------------------------------------------------------------------->

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
