import {Route, Routes} from "react-router-dom";
import Editor from "./components/app/editor/Editor";

export default function App() {

    return (
        //  TODO: add ability to change route / redirect based on if we're logged in or not.

        <Routes>
            <Route path="/project-group-fearless-foxes" element={<Editor/>}>
                {/* TODO If we want anything within the editor, put route here */}
            </Route>
        </Routes>
    );
}