import { integer, pgEnum, pgTable, serial, text, varchar, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { users } from './userSchema';
import { relations, sql } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
});

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

export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  categories: many(postsToCategories),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  category: many(postsToCategories),
}));

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
