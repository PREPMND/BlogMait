"use client"

import { Tabs , TabsList ,TabsTrigger,TabsContent} from "@/components/ui/tabs"
import { useState } from "react"
import LoginForm from "./login-form"

export default function AuthLayout() {
    const [activeTab, setactiveTab] = useState('login')

    return (
        <div className="flex select-none *:select-none flex-col justify-center  items-center min-h-full min-w-full">
            <div className=" md:w-[40%] w-[50%] md:h-20 h-[48px] mt-10 md:text-3xl text-2xl font-medium flex items-center justify-center  md:rounded-md rounded-lg
            dark:bg-neutral-800  ">
                Welcome
            </div>
            <Tabs value={activeTab} onValueChange={setactiveTab} className="w-[70%] *:text-[18px] mt-4">
                <TabsList className="w-full *:text-[18px]">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent  value="login">
                    <div className="pt-4 pb-4 min-w-full">
                        <LoginForm/>
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