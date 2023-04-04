import {Route, Routes} from "react-router-dom";
import Editor from "./components/app/editor/Editor";
import DashboardLayout from "./components/app/dashboard/DashboardLayout";

export default function App() {

    return (
        //  TODO: add ability to change route / redirect based on if we're logged in or not.

        <Routes>
            <Route path="project-group-fearless-foxes" >
                <Route index element={<Editor/>} />
                <Route path="test" element={<DashboardLayout />}>

                </Route>
            </Route>

        </Routes>
    );
}