import React from "react";
import {Outlet} from "react-router-dom";
import DashboardFooter from "./DashboardFooter";
import EditorHeader from "../editor/header/EditorHeader";
import DashboardHeader from "./header/DashboardHeader";

export default function DashboardLayout() {
    return (
        <div className="h-screen flex flex-col">

            <DashboardHeader />

            {/* Main Space */}
            <main className="grow bg-zinc-300 ">
                <Outlet />
            </main>

            <div className="justify-self-end">
                <DashboardFooter/>
            </div>
        </div>
    );
}