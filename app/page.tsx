import Image from "next/image";
import PostDetail from "./post/[slug]/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <PostDetail/>
    </div>
  );
}
