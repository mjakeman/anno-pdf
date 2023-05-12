import {MoonIcon, SunIcon, UserCircleIcon} from "@heroicons/react/24/solid"
import { Cog6ToothIcon } from "@heroicons/react/24/solid"
import React, {useContext, useRef} from "react"
import { useState } from "react"
import { auth } from "../../../firebaseAuth"
import { useToast } from "../../../hooks/useToast"
import DarkModeToggle from "../../DarkModeToggle"
import Modal from "../../Modal"
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {signOut} from "firebase/auth";
import {RecentContext} from "../../../contexts/RecentContextProvider";
import {DarkModeContext} from "../../../App";
import {ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";

type SettingTabs = "account" | "settings"

interface SettingModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
}

export default function SettingModal({isVisible, onOutsideClick}: SettingModalProps) {
    const [activeTab, setActiveTab] = useState<SettingTabs>("account")
    const settingModal = useRef<HTMLDivElement>(null);
    const {clearDocBuffer } = useContext(RecentContext);

    const isAccountActive = activeTab === "account" ? "bg-neutral-200 dark:bg-anno-space-800" : ""
    const isSettingsActive = activeTab === "settings" ? "bg-neutral-200 dark:bg-anno-space-800" : ""

    return(
        <Modal isVisible={isVisible} onOutsideClick={onOutsideClick}>
        <div ref={settingModal} className="grid grid-cols-12 bg-white h-[90vh] rounded-md dark:bg-anno-space-100">
            <div className="col-span-3 mr-9 bg-neutral-100 h-full rounded-tl-md rounded-bl-md dark:bg-anno-space-700">
                <div className="flex flex-col justify-between h-full">
                   <div className="flex flex-col mt-8 gap-2">
                       <span onClick={()=>setActiveTab("account")} className={"cursor-pointer flex flex-row gap-4 items-center text-zinc-800 dark:text-white font-bold px-8 py-2 transition-colors hover:bg-gray-300 dark:hover:bg-anno-space-800 " + isAccountActive}>
                            <UserCircleIcon className="text-zinc-800 w-6 h-6 dark:text-white"/>
                        <span>My Account</span>
                        </span>
                       <span onClick={()=>setActiveTab("settings")} data-cy="settings-tab" className={"cursor-pointer flex flex-row gap-4 items-center px-8 py-2 font-bold transition-colors hover:bg-gray-300 dark:hover:bg-anno-space-800 " + isSettingsActive}>
                            <Cog6ToothIcon className="w-6 h-6"/>
                            <span>Settings</span>
                        </span>
                   </div>
                    <div className="mb-8">
                        <span onClick={()=>console.log('out')} className={"cursor-pointer flex flex-row gap-4 items-center px-8 py-2 text-zinc-800 dark:text-white font-bold transition-colors hover:bg-neutral-200 dark:hover:bg-anno-space-800 "}>
                            <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                            <span>Logout</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="col-span-7 p-5 rounded-md pl-4">
                {activeTab === "account" && <AccountContent/>}
                {activeTab === "settings" && <UserSettings/>}
            </div>
        </div>
        </Modal>
    )
}

function UserSettings() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const {clearDocBuffer } = useContext(RecentContext);

    const currentUser = useContext(AuthContext);

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

    async function handleSignOut(){
        try {
            await signOut(auth);
            clearDocBuffer();
            currentUser.setCurrentUser(null, null);
            navigate('/');
        } catch(error) {
            console.log(error);
            setErrorMessage('Error logging out. Please try again later.');
        };
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-4xl font-bold text-anno-red-primary">Settings</h1>
            <div className=" flex flex-row gap-4 items-center px-4 py-2 ">
                { isDarkMode ? <MoonIcon className="w-6 h-6 text-zinc-500 dark:text-white" /> : <SunIcon className="w-6 h-6 text-zinc-500 dark:text-white" />}
                <span className="text-zinc-500 dark:text-white">Theme</span>
                <div className="relative bg-gray-100 dark:bg-anno-space-900 rounded-lg dark:text-white ">
                    <div className="flex flex-row items-center mx-1">
                        <button onClick={() => turnOffDarkMode()} type="button" className="z-50 px-3 py-1 rounded-lg">Light</button>
                        <button onClick={() => turnOnDarkMode()} type="button" className="z-50 px-3 py-1 rounded-lg">Dark</button>
                        <div className={`${isDarkMode ? "translate-x-[90%]" : ""} transition-transform absolute bg-white dark:bg-anno-space-700 h-4/5 w-1/2 rounded-lg`}>
                        </div>
                    </div>
                </div>
            </div>
            <button data-cy="logout-button" className="bg-anno-red-primary py-1.5 px-4 text-white flex flex-row items-center justify-center rounded-lg gap-1 text-lg transition-colors hover:bg-anno-red-secondary" onClick={handleSignOut}>
                Sign Out
            </button>
            {errorMessage != '' && <div
                className="bg-anno-red-secondary bg-opacity-70 py-3 px-4 text-white flex flex-row items-center justify-center gap-1 text-sm">
                {errorMessage}
            </div>}
        </div>
    )}


function AccountContent() {
    const {addToast} = useToast();

    function onSave(){
        addToast({
            type: 'success',
            message: 'Save success',
            
        })
    }

    function onCancel(){
        addToast({
            type: 'info',
            message: 'Cancelled',
        })
    }


    return (
        <div className="flex flex-col gap-12 mt-4">
        <h1 className="text-4xl font-bold text-anno-red-primary">My Account</h1>
        <div className="flex flex-col gap-4 ">
            <h2 className="text-lg font-medium dark:text-white">Personal Information</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                <div className="w-1/2 flex flex-col gap-2">
                    <label className=" text-gray-400 dark:text-white">First Name</label>
                    <input className="rounded-md border-2" type="text" placeholder="First Name"/>
                </div>
                <div className="w-1/2 flex flex-col gap-2">
                    <label className=" text-gray-400 dark:text-white">Last Name</label>
                    <input className="rounded-md border-2" type="text" placeholder="Last Name"/>
                </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className=" text-gray-400 dark:text-white">Email</label>
                    <input className="rounded-md border-2" type="text" placeholder="Email"/>
                </div>
            </div>
            <div className="flex flex-row gap-4 ml-auto">
                <button className="bg-gray-200 text-gray-400 rounded-md px-4 py-2" onClick={onCancel}>Cancel</button>
                <button className="bg-anno-red-primary text-white rounded-md px-4 py-2" onClick={onSave}>Save</button>
            </div>
        </div>
        <div className="flex flex-col gap-4 ">
            <h2 className="text-lg font-medium dark:text-white">Change Password</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className=" text-gray-400 dark:text-white">Password</label>
                    <input className="rounded-md border-2" type="text" placeholder="Password"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className=" text-gray-400 dark:text-white">Confirm Password</label>
                    <input className="rounded-md border-2" type="text" placeholder="Confirm Password"/>
                </div>
            </div>
            <div className="flex flex-row gap-4 ml-auto">
                <button className="bg-gray-200 text-gray-400 rounded-md px-4 py-2" onClick={onCancel}>Cancel</button>
                <button className="bg-anno-red-primary text-white rounded-md px-4 py-2" onClick={onSave}>Save</button>
            </div>
        </div>
        </div>

    )
}                


