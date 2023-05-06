import {Route, Routes} from "react-router-dom";
import Editor from "./components/app/editor/Editor";
import DashboardLayout from "./components/app/dashboard/DashboardLayout";
import Dashboard from "./components/app/dashboard/Dashboard";
import PublicLayout from "./components/public/layout/PublicLayout";
import Home from "./components/public/pages/Home";
import About from "./components/public/pages/About";
import Contact from "./components/public/pages/Contact";
import Terms from "./components/public/pages/Terms";
import Login from "./components/public/pages/Login";
import SignUp from "./components/public/pages/SignUp";
import useLocalStorage from "./hooks/useLocalStorage";
import React, {createContext, useEffect, useState} from "react";
import { ToastProvider } from "./hooks/useToast";
import {AuthContext, CurrentUser} from "./contexts/AuthContextProvider";

export const DarkModeContext = createContext<any[]>([]);
export default function App() {

    const [isDarkMode, setIsDarkMode] = useLocalStorage('isDarkMode', false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        isDarkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    }, [isDarkMode]);

    return (
        <AuthContext.Provider value={{currentUser, setCurrentUser}}>
            <DarkModeContext.Provider value={[isDarkMode, setIsDarkMode]}>
                <ToastProvider>
                    <Routes>
                            <Route path="/" element={<PublicLayout />}>
                                <Route index element={<Home/>} />
                                <Route path="about" element={<About/>} />
                                <Route path="contact" element={<Contact/>} />
                                <Route path="terms" element={<Terms/>} />
                                <Route path="login" element={<Login/>} />
                                <Route path="signup" element={<SignUp/>} />
                            </Route>
                            <Route path="/dash" element={<DashboardLayout />}>
                                <Route index element={<Dashboard/>} />
                            </Route>
                            <Route path="/document/:documentUuid" element={<Editor/>} />
                    </Routes>
                </ToastProvider>
            </DarkModeContext.Provider>
        </AuthContext.Provider>
        );
}
