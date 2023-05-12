import React from "react";
import {Outlet} from "react-router-dom";
import DashboardFooter from "./DashboardFooter";
import DashboardHeader from "./header/DashboardHeader";
import CommandMenuDialog from "./header/commandmenu/dialog/CommandMenuDialog";
import useDialogToggle from "../../../hooks/useDialogToggle";

export default function DashboardLayout() {

    // TODO: refactor to context?
    const [showSearchDialog, setShowSearchDialog] = useDialogToggle('Escape', 'k');

    return (
            <>
                    {/* Modals */}
                    {showSearchDialog &&
                        <div className="fixed z-50 inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                            <CommandMenuDialog onClose={() => setShowSearchDialog(false)}/>
                        </div>
                    }

                    {/* Core Layout */}
                    <div className="h-screen flex flex-col">

                        <DashboardHeader onCommandMenuClicked={() => setShowSearchDialog(true)}/>

                        {/* Main Space */}
                        <main className="grow bg-white dark:bg-anno-space-900">
                            <Outlet />
                        </main>

                        <div className="justify-self-end">
                            <DashboardFooter/>
                        </div>

                    </div>
            </>
    );
}