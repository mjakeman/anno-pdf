import {Route, Routes, useNavigate} from "react-router-dom";
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
import React, {createContext, useEffect, useState,} from "react";
import { ToastProvider } from "./hooks/useToast";
import {AuthContext, } from "./contexts/AuthContextProvider";
import {auth} from "./firebaseAuth";
import {signOut, User,} from "firebase/auth";
import axios from "axios";

export const DarkModeContext = createContext<any[]>([]);
export default function App() {

    const [isDarkMode, setIsDarkMode] = useLocalStorage('isDarkMode', false);
    const [currentUser, setCurrentUser] = useLocalStorage('user', null);
    const [firebaseUserRef, setFirebaseUserRef] = useState<User | null>(null);

    async function validateWithBackend(token: string) {
        console.log("Performing common user fetch ");
        axios.post(import.meta.env.VITE_BACKEND_URL + '/user', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function (response) {
            if (response.status == 200 || response.status == 201) {
                setCurrentUser({
                    uid: response.data.uid,
                    name: response.data.name,
                    email: response.data.email,
                });
                setFirebaseUserRef(auth.currentUser!);
            }
        }).catch(async function (error) {
            console.log(`Error: ${error.name} (${error.code})`);
            await signOut(auth);
        });
    }

    useEffect(() => {
        isDarkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    }, [isDarkMode]);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
                if (currentUser) {
                    setCurrentUser({
                        uid: currentUser.uid,
                        name: currentUser.name,
                        email: currentUser.email,
                    });
                    setFirebaseUserRef(user)
                    return;
                }
                await user.getIdToken()
                    .then((token) => {
                        validateWithBackend(token);
                    })
                    .catch(async error => {
                        await signOut(auth);
                    });
            } else {
                setCurrentUser(null);
                setFirebaseUserRef(null);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{currentUser, setCurrentUser, firebaseUserRef}}>
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
