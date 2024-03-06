import { integer, pgEnum, pgTable, serial, text, varchar, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { collectionToPosts, users } from './userSchema';
import { relations, sql } from 'drizzle-orm';

// <-------------------Posts Model-------------------------->
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  desc: varchar('desc', { length: 100 }),
  thumbnailImg: varchar('thumbnailImg', { length: 100 }),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  categories: many(postsToCategories),
  likes: many(likes),
  comments: many(comments),
  collections: many(collectionToPosts),
}));
// ----------------------------------------------------------------

// <-------------------------Like Model---------------------------------->
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes?.postId],
    references: [posts?.id],
  }),
  user: one(users, {
    fields: [likes?.userId],
    references: [users?.id],
  }),
}));
// ----------------------------------------------------------------------

export const commentLikes = pgTable('comment_likes', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  commentId: integer('comment_id').references(() => comments?.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users?.id, { onDelete: 'cascade' }),
});

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes?.commentId],
    references: [comments?.id],
  }),
  user: one(users, {
    fields: [commentLikes?.userId],
    references: [users?.id],
  }),
}));

// <-------------------------Comment Model------------------------------>
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  comment: varchar('comment'),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments?.postId],
    references: [posts?.id],
  }),
  user: one(users, {
    fields: [comments?.userId],
    references: [users?.id],
  }),
  likes: many(commentLikes),
  replies: many(replies),
}));
// ----------------------------------------------------------------------------

// <----------------------------Reply Model------------------------------------>
export const replies = pgTable('replies', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  comment: varchar('comment'),
  parentCommentId: integer('parent_comment_id').references(() => comments?.id, { onDelete: 'cascade' }),
  likes: integer('likes').references(() => likes?.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users?.id, { onDelete: 'cascade' }),
});

export const repliesRelations = relations(replies, ({ one, many }) => ({
  comment: one(comments, {
    fields: [replies?.parentCommentId],
    references: [comments?.id],
  }),
  user: one(users, {
    fields: [replies?.userId],
    references: [users?.id],
  }),
  likes: many(replyLikes),
}));
// <--------------------------------------------------------------------------->

export const replyLikes = pgTable('reply_likes', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  replyId: integer('reply_id').references(() => replies?.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users?.id, { onDelete: 'cascade' }),
});

export const replyLikesRelations = relations(replyLikes, ({ one }) => ({
  reply: one(replies, {
    fields: [replyLikes?.replyId],
    references: [replies?.id],
  }),
  user: one(users, {
    fields: [replyLikes?.userId],
    references: [users?.id],
  }),
}));

// <----------------------Category Model-------------------------->
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  img: varchar('img'),
  bgColor: varchar('bg_color', { length: 50 }),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  category: many(postsToCategories),
}));
// ---------------------------------------------------------------------------

// <------------------------Post to Category Model---------------------------->
export const postsToCategories = pgTable(
  'posts_to_categories',
  {
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    catId: integer('cat_id').references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey(t.postId, t.catId),
  })
);

export const postsToCategoryRelations = relations(postsToCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postsToCategories?.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postsToCategories?.catId],
    references: [categories.id],
  }),
}));
// ----------------------------------------------------------------------
