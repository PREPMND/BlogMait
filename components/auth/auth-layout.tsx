'use-client'

import { Tabs } from "@base-ui/react"
import { useState } from "react"

export default function AuthLayout(){
    const [activeTab,setactiveTab]=useState('login')

    return(
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="border-b border-r border-neutral-800 dark:border-neutral-400 ">
                Welcome
            </div>
            <Tabs value={activeTab} onValueChange={setactiveTab} className="border-b border-r border-neutral-800 dark:border-neutral-400">
                <Tabs.List>
                    <Tabs.Trigger value="login">Login</Tabs.Trigger>
                    <Tabs.Trigger value="register">Register</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="login">
                    <p>Login content goes here.</p>
                </Tabs.Content>
                <Tabs.Content value="register">
                    <p>Register content goes here.</p>
                </Tabs.Content>
            </Tabs>
        </div>
    )
}