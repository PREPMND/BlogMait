import { PostForm } from "@/components/post/post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePost(){
    return (
        <>
        <div className="py-10">
            <div className="max-w-4xl mx-auto">
                <Card className="w-[80%] mx-auto">
                    <CardHeader className="">
                        <CardTitle className="text-center text-4xl font-medium">Create New Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PostForm/>
                    </CardContent>
                </Card>
            </div>
        </div>
        </>
    )
}