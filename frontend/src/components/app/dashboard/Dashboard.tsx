import DashboardTable from "./DashboardTable";


export default function Dashboard() {
    return (
        <div className="mx-12 flex flex-col gap-4" id="portal-destination">
            <h1 className="text-anno-red-primary text-4xl font-bold">Documents</h1>
            <DashboardTable/>
        </div>

    );
}

function uploadPDF() {
    console.log("Upload PDF")
}