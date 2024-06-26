import CommandMenuButton from "./commandmenu/CommandMenuButton";
import React, {useContext, useState} from "react";
import Logo from "../../../Logo";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import ProfileDropdown from "./ProfileDropdown";
import SettingModal from "../../setting/SettingModal";
import {AuthContext} from "../../../../contexts/AuthContextProvider";
import {generateUniqueColors} from "../../../public/ProfileHashUtil";

interface DashboardHeaderProps {
    onCommandMenuClicked: (params: any) => any,
}

export default function DashboardHeader({  onCommandMenuClicked } : DashboardHeaderProps) {

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

    const {currentUser} = useContext(AuthContext);
    const {bgColor} = generateUniqueColors(currentUser!.email || "");
    const profileColor = {
        backgroundColor: bgColor,
    }

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
                <button onClick={() => setShowProfileDropdown(true)} data-cy="profile-toggle" className="flex flex-row gap-4 items-center p-3 transition-colors hover:bg-slate-100 dark:hover:bg-anno-space-800 rounded-xl">
                    <div className="grid place-items-center rounded text-white font-bold w-6 h-6" style={profileColor}>
                        {currentUser?.name[0].toUpperCase()}
                    </div>
                    <span className="text-lg text-black dark:text-white">{currentUser?.name}</span>
                    <ChevronDownIcon className="text-slate-500 dark:text-white w-6 h-6" />
                </button>
                {showProfileDropdown &&
                    <div className="absolute right-0">
                        <ProfileDropdown onOutsideClick={() => setShowProfileDropdown(false)} onAccountSettingsClicked={()=>openSettingModal()}/>
                    </div>
                }
            </div>
            <SettingModal isVisible={isSettingModalOpen} onOutsideClick={()=>{setIsSettingModalOpen(false)}}/>
        </header>
    );

    function openSettingModal() {
        setShowProfileDropdown(false);
        setIsSettingModalOpen(true);
    }
}