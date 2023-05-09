import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Editor, {UserData} from "./components/app/editor/Editor";
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
import PageNotFound from "./components/public/pages/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";

export const DarkModeContext = createContext<any[]>([]);
export default function App() {

    const [isDarkMode, setIsDarkMode] = useLocalStorage('isDarkMode', false);
    const [currentUser, setCurrentUserInternal] = useLocalStorage('user', null);
    const [firebaseUserRef, setFirebaseUserRef] = useState<User | null>(null);

    const setCurrentUser = (user: UserData|null, firebaseRef: User|null) => {
        setCurrentUserInternal(user);
        setFirebaseUserRef(firebaseRef);
    }

    async function validateWithBackend(token: string) {
        console.log("Performing common user fetch ");
        axios.post(import.meta.env.VITE_BACKEND_URL + '/user', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function (response) {
            if (response.status == 200 || response.status == 201) {
                setCurrentUserInternal({
                    id: response.data.uid,
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
                    setCurrentUserInternal({
                        id: currentUser.uid,
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
                setCurrentUserInternal(null);
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
                            <Route path='*' element={<Navigate to="/notfound"></Navigate>} ></Route>
                            <Route path="/" element={<PublicLayout />}>
                                <Route index element={<Home/>} />
                                <Route path="about" element={<About/>} />
                                <Route path="contact" element={<Contact/>} />
                                <Route path="terms" element={<Terms/>} />
                                <Route path="login" element={<Login/>} />
                                <Route path="signup" element={<SignUp/>} />
                                <Route path="notfound" element={<PageNotFound/>}/>
                            </Route>
                            <Route path="/dash" element={
                                <ProtectedRoute outlet={<DashboardLayout />}></ProtectedRoute>
                            }>
                                <Route index element={<Dashboard/>} />
                            </Route>
                            <Route path="/document/:documentUuid" element={<ProtectedRoute outlet={<Editor/>}></ProtectedRoute>} />
                    </Routes>
                </ToastProvider>
            </DarkModeContext.Provider>
        </AuthContext.Provider>
        );
}
