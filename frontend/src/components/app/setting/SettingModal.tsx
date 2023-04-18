import { UserCircleIcon } from "@heroicons/react/24/solid"
import { Cog6ToothIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

type SettingTabs = "account" | "settings"

export default function SettingModal(){
    const [activeTab, setActiveTab] = useState<SettingTabs>("account")

    return(
        <div className="grid grid-cols-10 h-full">
            <div className="col-span-3 bg-gray-200">
                <div className="flex flex-col gap-4">
                    <span onClick={()=>setActiveTab("account")} className="flex flex-row gap-4 items-center px-4 py-2 transition-colors hover:bg-gray-300 dark:hover:bg-anno-space-800 rounded-lg">
                        <UserCircleIcon className="text-zinc-500 w-6 h-6 dark:text-white"/>
                        <span className="text-zinc-500 dark:text-white">My Account</span>
                    </span>
                    <span onClick={()=>setActiveTab("settings")} className="flex flex-row gap-4 items-center px-4 py-2 transition-colors hover:bg-gray-300 dark:hover:bg-anno-space-800 rounded-lg">
                        <Cog6ToothIcon className="text-zinc-500 w-6 h-6 dark:text-white"/>
                        <span className="text-zinc-500 dark:text-white">Settings</span>
                    </span>
                    </div>
            </div>
            <div className="col-span-7">
                {activeTab === "account" && <AccountContent/>}
                {activeTab === "settings" && <div>Settings</div>}
            </div>
        </div>



    )
}

function AccountContent() {
    return (
        <>
        <h1 className="text-2xl font-bold text-anno-red-primary">My Account</h1>
        <div className="flex flex-col gap-4 ">
            <h2>Personal Information</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <label className="w-1/4">First Name</label>
                    <input className="w-3/4" type="text" placeholder="John"/>
                    
                
                </div>
            </div>
        </div>
        </>

    )
}                
