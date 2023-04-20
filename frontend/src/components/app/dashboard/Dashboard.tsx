import DashboardTable from "./DashboardTable";
import FabricJSCanvas from "../editor/FabricJSCanvas";


export default function Dashboard() {
    return (
        <div className="mx-12 flex flex-col gap-4">
            <h1 className="text-anno-red-primary text-4xl font-bold">Documents</h1>
            <DashboardTable/>
            {/* TODO: move this to editor */}
            <FabricJSCanvas/>
        </div>

    );
}

function uploadPDF() {
    console.log("Upload PDF")
}