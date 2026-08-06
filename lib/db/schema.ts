import { varchar } from 'drizzle-orm/mysql-core'
import {pgTable} from 'drizzle-orm/pg-core'

export const users = pgTable('users',{
    id:varchar('id',{length:255}).primaryKey(),
    name:varchar('name',{length:255}).notNull(),
    email:varchar('email',{})
})