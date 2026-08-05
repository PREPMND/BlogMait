'use-client'

import { Tabs , TabsList ,TabsTrigger} from "@/components/ui/tabs"
import { useState } from "react"

export default function AuthLayout() {
    const [activeTab, setactiveTab] = useState('login')

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="border-b border-r border-neutral-800 dark:border-neutral-400 ">
                Welcome
            </div>
            <Tabs value={activeTab} onValueChange={setactiveTab} className="border-b border-r border-neutral-800 dark:border-neutral-400">
                <TabsList>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}