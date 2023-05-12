import {Cog6ToothIcon, MoonIcon, SunIcon, UserCircleIcon} from "@heroicons/react/24/solid"
import React, {useContext, useRef, useState} from "react"
import {auth} from "../../../firebaseAuth"
import {useToast} from "../../../hooks/useToast"
import Modal from "../../Modal"
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {signOut} from "firebase/auth";
import {RecentContext} from "../../../contexts/RecentContextProvider";
import {DarkModeContext} from "../../../App";
import {ArrowRightOnRectangleIcon, InformationCircleIcon} from "@heroicons/react/24/outline";

type SettingTabs = "account" | "settings"

interface SettingModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
}

export default function SettingModal({isVisible, onOutsideClick}: SettingModalProps) {
    const [activeTab, setActiveTab] = useState<SettingTabs>("account")
    const settingModal = useRef<HTMLDivElement>(null);
    const {clearDocBuffer } = useContext(RecentContext);
    const currentUser = useContext(AuthContext);
    const navigate = useNavigate();
    const {addToast} = useToast();
    const isAccountActive = activeTab === "account" ? "bg-neutral-200 dark:bg-anno-space-700 dark:hover:bg-anno-space-700" : ""
    const isSettingsActive = activeTab === "settings" ? "bg-neutral-200 dark:bg-anno-space-700 dark:hover:bg-anno-space-700" : ""

    async function handleSignOut(){
        try {
            await signOut(auth);
            clearDocBuffer();
            currentUser.setCurrentUser(null, null);
            navigate('/');
        } catch(error) {
            addToast({
                message: 'Error logging out. Please try again later.',
                type: 'error',
            })
        }
    }

    return(
        <Modal isVisible={isVisible} onOutsideClick={onOutsideClick}>
        <div ref={settingModal} className="grid grid-cols-12 bg-white rounded-md dark:bg-anno-space-900">
            <div className="col-span-3 mr-9 bg-neutral-100 h-full rounded-tl-md rounded-bl-md dark:bg-anno-space-800">
                <div className="flex flex-col justify-between h-full">
                   <div className="flex flex-col mt-8 gap-2">
                       <span onClick={()=>setActiveTab("account")} className={"cursor-pointer flex flex-row gap-4 items-center text-zinc-800 dark:text-white font-bold px-8 py-2 transition-colors hover:bg-bg-neutral-200 dark:hover:bg-anno-space-700 " + isAccountActive}>
                            <UserCircleIcon className="text-zinc-800 w-6 h-6 dark:text-white"/>
                        <span>My Account</span>
                        </span>
                       <span onClick={()=>setActiveTab("settings")} data-cy="settings-tab" className={"cursor-pointer flex flex-row gap-4 items-center px-8 py-2 text-zinc-800 dark:text-white font-bold transition-colors hover:bg-bg-neutral-200 dark:hover:bg-anno-space-700 " + isSettingsActive}>
                            <Cog6ToothIcon className="w-6 h-6"/>
                            <span>Settings</span>
                        </span>
                   </div>
                    <div className="mb-8">
                        <span onClick={()=>handleSignOut()} data-cy="logout-button" className={"cursor-pointer flex flex-row gap-4 items-center px-8 py-2 text-zinc-800 dark:text-white font-bold transition-colors hover:bg-neutral-200 dark:hover:bg-anno-space-700 "}>
                            <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                            <span>Logout</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="col-span-7 p-5 rounded-md pl-4 min-h-[26rem]">
                {activeTab === "account" && <AccountContent/>}
                {activeTab === "settings" && <UserSettings/>}
            </div>
        </div>
        </Modal>
    )
}

function UserSettings() {

    const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);


    function turnOnDarkMode() {
        if (!isDarkMode) {
            setIsDarkMode(true);
        }
    }

    function turnOffDarkMode() {
        if (isDarkMode) {
            setIsDarkMode(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">Settings</h1>
            <div className=" flex flex-row gap-4 items-center py-2 ">
                { isDarkMode ? <MoonIcon className="w-6 h-6 text-zinc-500 dark:text-white" /> : <SunIcon className="w-6 h-6 text-zinc-500 dark:text-white" />}
                <span className="text-zinc-500 dark:text-white">Theme</span>
                <div className="relative bg-gray-100 dark:bg-anno-space-800 rounded-lg dark:text-white ">
                    <div className="flex flex-row items-center mx-1">
                        <button onClick={() => turnOffDarkMode()} type="button" className="z-50 px-3 py-1 rounded-lg">Light</button>
                        <button onClick={() => turnOnDarkMode()} type="button" className="z-50 px-3 py-1 rounded-lg">Dark</button>
                        <div className={`${isDarkMode ? "translate-x-[90%]" : ""} transition-transform absolute bg-white dark:bg-anno-space-700 h-4/5 w-1/2 rounded-lg`}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}


function AccountContent() {
    const {currentUser} = useContext(AuthContext);

    return (
        <div className="flex flex-col mt-4">
            <h1 className="text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">My Account</h1>

            {/* Personal Info */}
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-blue-400 text-white px-4 py-2 rounded flex flex-row gap-2 items-center">
                    <InformationCircleIcon className="text-white h-6 w-6"/>
                    <span>You cannot currently change your personal details.</span>
                </div>
                <h2 className="text-lg font-bold dark:text-white">Personal Info</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-400 dark:text-white">Name</label>
                        <input disabled className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light w-full rounded-md dark:text-white" type="text" placeholder={currentUser!.name}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-400 dark:text-white">Email</label>
                        <input disabled className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light w-full rounded-md dark:text-white" type="email" placeholder={currentUser!.email}/>
                    </div>
                </div>
                <div className="flex flex-row gap-4 ml-auto">
                    <button disabled className="disabled:cursor-not-allowed bg-gray-200 text-zinc-500 rounded-md px-4 py-2">Cancel</button>
                    <button disabled className="disabled:cursor-not-allowed disabled:bg-zinc-300 bg-anno-red-primary text-white rounded-md px-4 py-2">Save</button>
                </div>
            </div>
            <div className="flex flex-col gap-4 ">
                <h2 className="text-lg font-medium dark:text-white">Change Password</h2>
                <div className="bg-zinc-300 text-zinc-600 px-4 py-2 rounded flex flex-row gap-2 items-center">
                    <InformationCircleIcon className="text-zinc-600 h-6 w-6"/>
                    <span>This feature is coming soon!</span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className=" text-gray-400 dark:text-white">Password</label>
                        <input disabled className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light w-full rounded-md dark:text-white" type="text" placeholder="Password"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className=" text-gray-400 dark:text-white">Confirm Password</label>
                        <input disabled className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light w-full rounded-md dark:text-white" type="text" placeholder="Confirm Password"/>
                    </div>
                </div>
                <div className="flex flex-row gap-4 ml-auto">
                    <button disabled className="disabled:cursor-not-allowed bg-gray-200 text-zinc-500 rounded-md px-4 py-2">Cancel</button>
                    <button disabled className="disabled:cursor-not-allowed disabled:bg-zinc-300 bg-anno-red-primary text-white rounded-md px-4 py-2">Save</button>
                </div>
            </div>
        </div>

    )
}                


