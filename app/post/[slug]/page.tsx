import Perfect3DTiltCard from "@/components/ui/card-tactical";
import BlogCard from "@/components/ui/card-tactical1";
import { title } from "process";
import { describe } from "zod/v4/core";
import { id } from "zod/v4/locales";

export default function PostDetail(){
    const Posts=[
        {
        title:'hey',description:"The second effect is much more advanced (think Apples liquid glass or a localized 3D warp and uses a moving radial highlight/normal map illusion rather than just rotating the whole card. It looks significantly more premium if that's the effect you're after.",slug:'hey',id:1
        },
        {
            title:'hey',description:'hey',slug:'hey',id:2,image:"https://images.unsplash.com/photo-1784656217227-2ed7ee091176?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title:'hey',description:'hey',slug:'hey',id:3,image:"https://images.unsplash.com/photo-1781882915155-2a5355116a74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2MHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title:'hey',description:'hey',slug:'hey',id:4,image:"https://plus.unsplash.com/premium_photo-1785584592505-1f54b5c1e854?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title:'hey',description:'hey',slug:'hey',id:5,image:"https://images.unsplash.com/photo-1785790145108-1e3cf8d20487?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4MXx8fGVufDB8fHx8fA%3D%3D"
        }
        ]
    return(
        <>
        <div className="grid  xs:grid-cols-2 lg:grid-cols-3 mb-10 mt-10 place-items-evenly gap-10 ">
            {Posts.map((post)=>(
                <div className="" key={post.id}>
                    <Perfect3DTiltCard title={post.title} description={post.description} slug={post.slug} id={post.id}/>
                </div>
            ))}
        </div>
        </>
    )
}