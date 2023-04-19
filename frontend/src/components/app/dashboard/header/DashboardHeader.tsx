import CommandMenuButton from "./commandmenu/CommandMenuButton";
import React, {useState} from "react";
import Logo from "../../../Logo";
import {ChevronDownIcon, Cog6ToothIcon, MoonIcon, SunIcon} from "@heroicons/react/24/solid";
import ProfileBubble, {ProfileBubbleSizes} from "../../../ProfileBubble";
import {Link} from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

interface DashboardHeaderProps {
    onCommandMenuClicked: (params: any) => any,
}

export default function DashboardHeader({  onCommandMenuClicked } : DashboardHeaderProps) {

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    return (
        <header className="p-4 flex flex-row items-center justify-between dark:bg-anno-space-900">
            <div className="flex flex-row gap-4 items-center">
                <Logo className="w-8 h-8"/>
                <button type="button" className="relative hover:cursor-not-allowed transition-colors hover:bg-slate-100 dark:hover:bg-anno-space-800 p-3 rounded-xl gap-12 flex flex-row items-center justify-between ">
                    <span className="text-anno-red-primary dark:text-anno-pink-500 font-semibold">My Workspace</span>
                    <ChevronDownIcon className="text-anno-red-secondary dark:text-anno-pink-500 w-6 h-6" />
                </button>
            </div>
            <CommandMenuButton onClick={onCommandMenuClicked}/>
            <div className="relative">

            </div>
            <div className="relative">
                <button onClick={() => setShowProfileDropdown(true)} className="flex flex-row gap-4 items-center p-3 transition-colors hover:bg-slate-100 dark:hover:bg-anno-space-800 rounded-xl">
                    {/*TODO: replace with profile square component*/}
                    <div className="grid place-items-center rounded text-white font-bold w-6 h-6 bg-blue-800">
                        J
                    </div>
                    <span className="text-lg text-black dark:text-white">John Doe</span>
                    <ChevronDownIcon className="text-slate-500 dark:text-white w-6 h-6" />
                </button>
                {showProfileDropdown &&
                    <div className="absolute right-0">
                        <ProfileDropdown onOutsideClick={() => setShowProfileDropdown(false)} onAccountSettingsClicked={()=>setShowProfileDropdown(false)}/>
                    </div>
                }
            </div>

        </header>
    );
}