import {pgTable,varchar,boolean, timestamp} from 'drizzle-orm/pg-core'

export const users = pgTable('users',{
    id:varchar('id',{length:255}).primaryKey(),
    name:varchar('name',{length:255}).notNull(),
    email:varchar('email',{length:255}).notNull().unique(),
    emailVerified:boolean("email_verfiied").default(false),
    createAt:timestamp
})