import CommandMenuButton from "./commandmenu/CommandMenuButton";
import {useState} from "react";

interface DashboardHeaderProps {
    onCommandMenuClicked: (params: any) => any,
}

export default function DashboardHeader({  onCommandMenuClicked } : DashboardHeaderProps) {

    return (
        <div>
            <header className="p-4 flex flex-row">
                <CommandMenuButton onClick={onCommandMenuClicked}/>
            </header>
        </div>

    );
}