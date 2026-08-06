import Perfect3DTiltCard from "@/components/ui/card-tactical";
import BlogCard from "@/components/ui/card-tactical1";
import { title } from "process";
import { describe } from "zod/v4/core";
import { id } from "zod/v4/locales";

export default function PostDetail(){
    const Posts=[
        {
        title:'hey',description:'hey',slug:'hey',id:1
        },
        {
            title:'hey',description:'hey',slug:'hey',id:2
        },
        {
            title:'hey',description:'hey',slug:'hey',id:3
        },
        {
            title:'hey',description:'hey',slug:'hey',id:4
        },
        {
            title:'hey',description:'hey',slug:'hey',id:5
        }
        ]
    return(
        <>
        <div>
            post detail
            {Posts.map((post)=>(
                <div key={post.id}>
                    <Perfect3DTiltCard title={}
                </div>
            ))}
        </div>
        </>
    )
}