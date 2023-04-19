import { UserCircleIcon } from "@heroicons/react/24/solid"
import { Cog6ToothIcon } from "@heroicons/react/24/solid"
import { useRef } from "react"
import { useState } from "react"
import useDetectOutsideClick from "../../../hooks/useDetectOutsideClick"
import DarkModeToggleTest from "../../DarkModeToggleTest"
import Modal from "../../Modal"

type SettingTabs = "account" | "settings"

interface SettingModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
}

export default function SettingModal({isVisible, onOutsideClick}: SettingModalProps) {
    const [activeTab, setActiveTab] = useState<SettingTabs>("account")
    const settingModal = useRef<HTMLDivElement>(null);

    return(
        <Modal isVisible={isVisible} onOutsideClick={onOutsideClick}>
        <div ref={settingModal} className="grid grid-cols-10 bg-white h-full">
            <div className="col-span-3 bg-gray-200 h-full">
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
            <div className="col-span-7 p-5">
                {activeTab === "account" && <AccountContent/>}
                {activeTab === "settings" && <DarkModeToggleTest/>}
            </div>
        </div>
        </Modal>
    )
}

function AccountContent() {

    return (
        <div className="flex flex-col gap-12">
        <h1 className="text-2xl font-bold text-anno-red-primary">My Account</h1>
        <div className="flex flex-col gap-4 ">
            <h2 className="text-lg font-medium">Personal Information</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                <div className="w-1/2 flex flex-col gap-2">
                    <label className=" text-gray-400">First Name</label>
                    <input className="rounded-md border-2" type="text" placeholder="First Name"/>
                </div>
                <div className="w-1/2 flex flex-col gap-2">
                    <label className=" text-gray-400">Last Name</label>
                    <input className="rounded-md border-2" type="text" placeholder="Last Name"/>
                </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">Email</label>
                    <input className="rounded-md border-2" type="text" placeholder="Email"/>
                </div>
            </div>
            <div className="flex flex-row gap-4 ml-auto">
                <button className="bg-gray-200 text-gray-400 rounded-md px-4 py-2">Cancel</button>
                <button className="bg-anno-red-primary text-white rounded-md px-4 py-2">Save</button>
            </div>
        </div>
        <div className="flex flex-col gap-4 ">
            <h2 className="text-lg font-medium">Change Password</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">Password</label>
                    <input className="rounded-md border-2" type="text" placeholder="Password"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">Confirm Password</label>
                    <input className="rounded-md border-2" type="text" placeholder="Confirm Password"/>
                </div>
            </div>
            <div className="flex flex-row gap-4 ml-auto">
                <button className="bg-gray-200 text-gray-400 rounded-md px-4 py-2">Cancel</button>
                <button className="bg-anno-red-primary text-white rounded-md px-4 py-2">Save</button>
            </div>
        </div>
        </div>

    )
}                
