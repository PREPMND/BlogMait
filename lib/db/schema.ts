import { relations } from 'drizzle-orm'
import { pgTable, varchar, boolean, timestamp, text, serial, integer, jsonb, index } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    image: varchar('image', { length: 255 }),
    emailVerified: boolean("email_verfiied").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).references(() => users.id).notNull(),
    token: varchar('token', { length: 255 }),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: varchar('ip_address', { length: 255 }),
    userAgent: text('user_agent'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).references(() => users.id).notNull(),
    accountId: varchar('account_id', { length: 255 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    password: text('password'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    content: text('content').default(''),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    authorId: varchar('author_id', { length: 255 }).references(() => users.id).notNull(),
    isPublished: boolean('is_published').default(false),
    isDraft: boolean('is_draft').default(true),
    thumbnail: varchar("thumbnail", { length: 500 }).notNull(),
    imageSource: varchar("image_source", { length: 20 }),
    readingTime: integer("reading_time").default(0),
    views: integer("views").default(0),
    scheduledAt: timestamp("scheduled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("posts_slug_idx").on(table.slug),
    index("posts_author_idx").on(table.authorId),
    index("posts_published_idx").on(table.isPublished),
])

export const tags = pgTable('tags', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const postTags = pgTable('post_tags', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    tagId: integer('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => [
    index("post_tags_post_idx").on(table.postId),
    index("post_tags_tag_idx").on(table.tagId),
])

export const postRevisions = pgTable('post_revisions', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').default(''),
    editedBy: varchar('edited_by', { length: 255 }).references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("revisions_post_idx").on(table.postId),
])

export const postViews = pgTable('post_views', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    ip: varchar('ip', { length: 45 }),
    userAgent: text('user_agent'),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
}, (table) => [
    index("views_post_idx").on(table.postId),
    index("views_date_idx").on(table.viewedAt),
])

export const postReactions = pgTable('post_reactions', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 30 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("reactions_post_idx").on(table.postId),
    index("reactions_user_idx").on(table.userId),
])

export const postSeries = pgTable('post_series', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    authorId: varchar('author_id', { length: 255 }).references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const postSeriesItems = pgTable('post_series_items', {
    id: serial('id').primaryKey(),
    seriesId: integer('series_id').references(() => postSeries.id, { onDelete: 'cascade' }).notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    order: integer('order').notNull(),
}, (table) => [
    index("series_items_series_idx").on(table.seriesId),
    index("series_items_post_idx").on(table.postId),
])

export const backgroundJobs = pgTable('background_jobs', {
    id: serial('id').primaryKey(),
    type: varchar('type', { length: 50 }).notNull(),
    payload: jsonb('payload'),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    attempts: integer('attempts').default(0),
    maxAttempts: integer('max_attempts').default(3),
    error: text('error'),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("jobs_status_idx").on(table.status),
    index("jobs_type_idx").on(table.type),
])

export const postReactionRelations = relations(postReactions, ({ one }) => ({
    post: one(posts, { fields: [postReactions.postId], references: [posts.id] }),
    user: one(users, { fields: [postReactions.userId], references: [users.id] }),
}))

export const postSeriesRelations = relations(postSeries, ({ one, many }) => ({
    author: one(users, { fields: [postSeries.authorId], references: [users.id] }),
    items: many(postSeriesItems),
}))

export const postSeriesItemRelations = relations(postSeriesItems, ({ one }) => ({
    series: one(postSeries, { fields: [postSeriesItems.seriesId], references: [postSeries.id] }),
    post: one(posts, { fields: [postSeriesItems.postId], references: [posts.id] }),
}))

export const postRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id]
    }),
    tags: many(postTags),
    revisions: many(postRevisions),
    viewRecords: many(postViews),
    reactions: many(postReactions),
    seriesItems: many(postSeriesItems),
}))

export const tagRelations = relations(tags, ({ many }) => ({
    posts: many(postTags),
}))

export const postTagRelations = relations(postTags, ({ one }) => ({
    post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
    tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}))

export const postRevisionRelations = relations(postRevisions, ({ one }) => ({
    post: one(posts, { fields: [postRevisions.postId], references: [posts.id] }),
    editor: one(users, { fields: [postRevisions.editedBy], references: [users.id] }),
}))

export const postViewRelations = relations(postViews, ({ one }) => ({
    post: one(posts, { fields: [postViews.postId], references: [posts.id] }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}))

export const schema = {
    users,
    accounts,
    sessions,
    posts,
    tags,
    postTags,
    postRevisions,
    postViews,
    postReactions,
    postSeries,
    postSeriesItems,
    backgroundJobs,
}
