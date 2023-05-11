import { UserCircleIcon } from "@heroicons/react/24/solid"
import { Cog6ToothIcon } from "@heroicons/react/24/solid"
import {useContext, useRef} from "react"
import { useState } from "react"
import { auth } from "../../../firebaseAuth"
import { useToast } from "../../../hooks/useToast"
import DarkModeToggle from "../../DarkModeToggle"
import Modal from "../../Modal"
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {signOut} from "firebase/auth";

type SettingTabs = "account" | "settings"

interface SettingModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
}

export default function SettingModal({isVisible, onOutsideClick}: SettingModalProps) {
    const [activeTab, setActiveTab] = useState<SettingTabs>("account")
    const settingModal = useRef<HTMLDivElement>(null);

    const isAccountActive = activeTab === "account" ? "bg-gray-300 dark:bg-anno-space-800" : ""
    const isSettingsActive = activeTab === "settings" ? "bg-gray-300 dark:bg-anno-space-800" : ""

    return(
        <Modal isVisible={isVisible} onOutsideClick={onOutsideClick}>
        <div ref={settingModal} className="grid grid-cols-10 bg-white h-[90vh] rounded-md dark:bg-anno-space-100">
            <div className="col-span-3 bg-gray-200 h-full rounded-md dark:bg-anno-space-700">
                <div className="flex flex-col gap-4 p-2">
                    <span onClick={()=>setActiveTab("account")} className={"flex flex-row gap-4 items-center px-4 py-2 transition-colors hover:bg-gray-300 dark:hover:bg-anno-space-800 rounded-lg " + isAccountActive}>
                        <UserCircleIcon className="text-zinc-500 w-6 h-6 dark:text-white"/>
                        <span className="text-zinc-500 dark:text-white">My Account</span>
                    </span>
                    <span onClick={()=>setActiveTab("settings")} className={"flex flex-row gap-4 items-center px-4 py-2 transition-colors hover:bg-gray-300 dark:hover:bg-anno-space-800 rounded-lg " + isSettingsActive}>
                        <Cog6ToothIcon className="text-zinc-500 w-6 h-6 dark:text-white"/>
                        <span className="text-zinc-500 dark:text-white">Settings</span>
                    </span>
                </div>
            </div>
            <div className="col-span-7 p-5 rounded-md ">
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

    const currentUser = useContext(AuthContext);

    async function handleSignOut(){
        try {
            await signOut(auth);
            currentUser.setCurrentUser(null, null);
            navigate('/');
        } catch(error) {
            console.log(error);
            setErrorMessage('Error logging out. Please try again later.');
        };
    }

    return (
        <div className="flex flex-col gap-4 h-800">
            <h1 className="text-2xl font-bold text-anno-red-primary">My Account</h1>
            <div className="flex flex-col gap-4 ">
                <DarkModeToggle/>
            </div>
            <button className="bg-anno-red-primary py-1.5 px-4 text-white flex flex-row items-center justify-center rounded-lg gap-1 text-lg transition-colors hover:bg-anno-red-secondary" onClick={handleSignOut}>
                Sign Out
            </button>
            {errorMessage != '' && <div
                className="bg-anno-red-secondary bg-opacity-70 py-3 px-4 text-white flex flex-row items-center justify-center gap-1 text-sm">
                {errorMessage}
            </div>}
        </div>
    )
}


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
        <div className="flex flex-col gap-12">
        <h1 className="text-2xl font-bold text-anno-red-primary">My Account</h1>
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


