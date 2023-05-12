import {Cog6ToothIcon, MoonIcon, SunIcon} from "@heroicons/react/24/solid";
import React, {useContext, useRef, useState} from "react";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";
import {DarkModeContext} from "../../../../App";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../firebaseAuth";
import {AuthContext} from "../../../../contexts/AuthContextProvider";
import { generateUniqueColors } from "../../../public/ProfileHashUtil";

interface Props {
    onOutsideClick: (params: any) => any,
    onAccountSettingsClicked: () => any,
}

export default function ProfileDropdown({ onOutsideClick, onAccountSettingsClicked } : Props) {

    const profileDropdownRef = useRef<HTMLDivElement>(null);

    const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);

    useDetectOutsideClick(profileDropdownRef, onOutsideClick)

    const {currentUser, setCurrentUser} = useContext(AuthContext);

    const {bgColor} = generateUniqueColors(currentUser!.email || "");
    const profileColor = {
        backgroundColor: bgColor,
    }
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
        <div ref={profileDropdownRef} className=" drop-shadow-around rounded-lg bg-white px-2 py-2 flex flex-col gap-4 dark:bg-anno-space-700 relative z-[100]">

            <div className="flex flex-row gap-4 items-center pl-4 py-2  pr-12">
                {/*TODO: replace with profile square component*/}
                <div className={"grid place-items-center rounded text-white font-bold h-10 w-10 text-2xl "} style={profileColor}>
                    {currentUser?.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="text-xl dark:text-white">{currentUser?.name}</span>
                    <span className="text-sm text-neutral-400 dark:text-white">{currentUser?.email}</span>
                </div>
            </div>
            <div onClick={()=>openSettingModal()} data-cy="open-settings" className="flex flex-row gap-4 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-anno-space-800 rounded-xl">
                <Cog6ToothIcon className="text-zinc-500 w-6 h-6 dark:text-white"/>
                <span className="text-zinc-500 dark:text-white">My Account</span>
            </div>
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

        </div>
    );
    function openSettingModal(){
        onAccountSettingsClicked();
    }
}
