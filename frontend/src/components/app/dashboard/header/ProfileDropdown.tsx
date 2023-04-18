import {Cog6ToothIcon, MoonIcon, SunIcon} from "@heroicons/react/24/solid";
import {Link} from "react-router-dom";
import React, {useContext, useRef, useState} from "react";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import {DarkModeContext} from "../../../../App";

interface ProfileDropdownProps {
    onOutsideClick: (params: any) => any,
}

export default function ProfileDropdown({ onOutsideClick } : ProfileDropdownProps) {

    const profileDropdownRef = useRef<HTMLDivElement>(null);

    const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);

    useDetectOutsideClick(profileDropdownRef, onOutsideClick)

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
        <div ref={profileDropdownRef} className=" drop-shadow-around rounded-lg bg-white px-2 py-2 flex flex-col gap-4 dark:bg-anno-space-700">
            <div className="flex flex-row gap-4 items-center pl-4 py-2  pr-12">
                {/*TODO: replace with profile square component*/}
                <div className="grid place-items-center rounded text-white font-bold h-10 w-10 text-2xl bg-blue-800">
                    J
                </div>
                <div className="flex flex-col">
                    <span className="text-xl dark:text-white">John Doe</span>
                    <span className="text-sm text-neutral-400 dark:text-white">johndoe@gmail.com</span>
                </div>
            </div>
            <Link to={"/project-group-fearless-foxes/account"} className="flex flex-row gap-4 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-anno-space-800 rounded-xl">
                <Cog6ToothIcon className="text-zinc-500 w-6 h-6 dark:text-white"/>
                <span className="text-zinc-500 dark:text-white">My Account</span>
            </Link>
            <div className="z-20 flex flex-row gap-4 items-center px-4 py-2 ">
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
}