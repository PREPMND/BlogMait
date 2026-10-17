CREATE TABLE "post_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"type" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"author_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "post_series_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"series_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_series" ADD CONSTRAINT "post_series_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_series_items" ADD CONSTRAINT "post_series_items_series_id_post_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."post_series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_series_items" ADD CONSTRAINT "post_series_items_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reactions_post_idx" ON "post_reactions" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "reactions_user_idx" ON "post_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "series_items_series_idx" ON "post_series_items" USING btree ("series_id");--> statement-breakpoint
CREATE INDEX "series_items_post_idx" ON "post_series_items" USING btree ("post_id");