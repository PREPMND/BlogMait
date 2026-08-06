import Perfect3DTiltCard from "@/components/ui/card-tactical";
import BlogCard from "@/components/ui/card-tactical1";
import { title } from "process";
import { describe } from "zod/v4/core";

export default function PostDetail(){
    const Posts=[{
        title:'hey',description:'hey'
    }]
    return(
        <>
        <div>
            post detail
            <Perfect3DTiltCard title="hey" description="hey" slug="yea" id={1}/>
        </div>
        </>
    )
}