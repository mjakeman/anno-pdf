import React, {useEffect, useRef, useState} from "react";
import {Outlet} from "react-router-dom";
import DashboardFooter from "./DashboardFooter";
import DashboardHeader from "./header/DashboardHeader";
import Overlay, {OverlayChildPosition} from "../../../Overlay";
import CommandMenuDialog from "./header/commandmenu/CommandMenuDialog";
import useDialogToggle from "../../../hooks/useDialogToggle";

export default function DashboardLayout() {

    // TODO: refactor to context?
    const [showDialog, setShowDialog] = useDialogToggle('Escape', 'k');

    return (
        <>
            {/* Modals */}
            {showDialog &&
                <Overlay onClick={() => setShowDialog(false) } twColor="black" position={OverlayChildPosition.MIDDLE}>
                    <CommandMenuDialog onClose={() => setShowDialog(false)}/>
                </Overlay>
            }

            {/* Core Layout */}
            <div className="h-screen flex flex-col">

                <DashboardHeader  onCommandMenuClicked={() => setShowDialog(true)}/>

                {/* Main Space */}
                <main className="grow bg-zinc-300 ">
                    <Outlet />
                </main>

                <div className="justify-self-end">
                    <DashboardFooter/>
                </div>

            </div>
        </>
    );
}