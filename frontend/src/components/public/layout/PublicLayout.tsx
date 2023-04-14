import DashboardHeader from "../../app/dashboard/header/DashboardHeader";
import {Outlet} from "react-router-dom";
import React from "react";
import PublicFooter from "./footer/PublicFooter";
import PublicHeader from "./header/PublicHeader";

export default function PublicLayout() {
    return (
        <div className="h-screen flex flex-col">

            <PublicHeader />

            {/* Main Space */}
            <main className="grow bg-white dark:bg-anno-space-900">
                <Outlet />
            </main>

            <div className="justify-self-end">
                <PublicFooter/>
            </div>

        </div>
    );
}