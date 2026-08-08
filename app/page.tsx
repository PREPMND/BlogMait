{/* <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black"></div> */ }
import Perfect3DTiltCard from "@/components/ui/card-tactical";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function Home() {
  const Posts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],

    with: {
      author: {
        columns: {
          name: true,
          image: true,
        },
      },
    },
  });
  

  return (
    <div className="grid xs:grid-cols-2 lg:grid-cols-3 mb-10 mt-10 place-items-evenly gap-10 md:gap-12 lg:gap-10">
      {Posts.map((post) => (
        <Perfect3DTiltCard
          key={post.id}
          title={post.title}
          description={post.description}
          thumbnail={post.thumbnail}
          image={post.author.image}
          username={post.author.name}

          href={`/post/${post.slug}`}
        />
      ))}
    </div>
  );
}
