import {pgTable,varchar,boolean, timestamp} from 'drizzle-orm/pg-core'

export const users = pgTable('users',{
    id:varchar('id',{length:255}).primaryKey(),
    name:varchar('name',{length:255}).notNull(),
    email:varchar('email',{length:255}).notNull().unique(),
    emailVerified:boolean("email_verfiied").default(false),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
})

export const sessions = pgTable('sessions',{
    id:varchar('id',{length:255}).primaryKey(),
    userId:varchar('user_id',{length:255}).references(()=>)
    name:varchar('name',{length:255}).notNull(),
    email:varchar('email',{length:255}).notNull().unique(),
    emailVerified:boolean("email_verfiied").default(false),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
})