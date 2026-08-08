ALTER TABLE "posts" RENAME COLUMN "authour_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_authour_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "thumbnail" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;