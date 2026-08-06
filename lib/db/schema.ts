import { relations  } from 'drizzle-orm'
import { pgTable, varchar, boolean, timestamp,text, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verfiied").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).references(() => users.id).notNull(),
    token:varchar('token',{length:255}),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddess:varchar('ip_address',{length:255}),
    userAgent:text('user_agent'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).references(() => users.id).notNull(),
    accountId :varchar('account_id', { length: 255 }).notNull(),
    providerId:varchar('provider_id', { length: 255 }).notNull(),
    password:text('password'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const posts = pgTable('posts',{
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description:varchar('description', { length: 255 }).notNull(),
    slug:varchar('slug', { length: 255 }).notNull().unique(),
    authorId:varchar('authour_id', { length: 255 }).references(() => users.id).notNull(),
    isPublished:boolean('is_published'),
    isDraft:boolean('is_draft'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const userRelations=relations(posts,({one})=>({
    author:one(users,{
        fields:[posts.authorId],
        references:[users.id]
    })
}))
//one auht/usr per post
export const postRelations=relations(posts,({one})=>({
    author:one(users,{
        fields:[posts.authorId],
        references:[users.id]
    })
}))