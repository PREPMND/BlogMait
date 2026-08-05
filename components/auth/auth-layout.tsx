"use client"

import { Tabs , TabsList ,TabsTrigger,TabsContent} from "@/components/ui/tabs"
import { useState } from "react"

export default function AuthLayout() {
    const [activeTab, setactiveTab] = useState('login')

    return (
        <div className="flex flex-col justify-center mt-[500px] items-center min-h-full min-w-full">
            <div className="w-[40%] h-20 text-3xl font-medium flex items-center justify-center  rounded-md
            bg-neutral-800 ">
                Welcome
            </div>
            <Tabs value={activeTab} onValueChange={setactiveTab} className="w-[60%] mt-4">
                <TabsList className="w-full">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <div className="p-4">
                        Login Form
                    </div>
                </TabsContent>
                <TabsContent value="register">
                    <div className="p-4">
                        Register Form
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}