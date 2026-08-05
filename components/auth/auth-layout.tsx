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
            <Tabs ></Tabs>
        </div>
    )
}