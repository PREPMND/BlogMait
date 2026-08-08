"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  id: string | number;
  title: string;
  description: string;
  slug: string;
}

export default function BlogCard1({ id, title, description, slug }: BlogCardProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handleSingleClick = () => {
    setIsPressed(true);
    
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  const handleDoubleClick = () => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={`
        w-full max-w-sm p-5 bg-white text-slate-800 select-none cursor-pointer
        border-2 border-slate-900 rounded-2xl
        shadow-[4px_4px_0px_0px_rgba(56,189,248,1)]
        transition-all duration-150 ease-out
        ${isPressed ? "translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(56,189,248,1)]" : ""}
         hover:shadow-[6px_6px_0px_0px_rgba(56,189,248,1)]
        active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_rgba(56,189,248,1)]
      `}
    >
      <div className="space-y-2">
        <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">Blog #{id}</span>
        <h3 className="text-xl font-extrabold tracking-tight leading-tight">{title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
        <div className="pt-2 text-xs font-semibold text-indigo-500 flex items-center gap-1">
          <span>⚡ Double click to open</span>
        </div>
      </div>
    </div>
  );
}
