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

export default function App() {

    return (
        //  TODO: add ability to change route / redirect based on if we're logged in or not.

        <Routes>Ï
            <Route path="project-group-fearless-foxes" element={<PublicLayout />}>
                <Route index element={<Home/>} />
                <Route path="about" element={<About/>} />
                <Route path="contact" element={<Contact/>} />
                <Route path="terms" element={<Terms/>} />
                <Route path="login" element={<Login/>} />
            </Route>
            <Route path="project-group-fearless-foxes/dash" element={<DashboardLayout />}>
                <Route index element={<Dashboard/>} />
            </Route>
            <Route path="project-group-fearless-foxes/editor" element={<Editor/>} />
        </Routes>
    );
}