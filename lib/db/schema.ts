import { primaryKey } from 'drizzle-orm/gel-core'
import {pgTable} from 'drizzle-orm/pg-core'

export const users = pgTable('users',{
    id:varchar('id',{length:255},primaryKey())
})