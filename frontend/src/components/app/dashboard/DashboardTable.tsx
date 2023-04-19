import { useCallback } from "react";
import { useState } from "react";
import PrimaryButton from "../../PrimaryButton";
import FilterButton from "./FilterButton";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../Tooltip";
const documentData = [
    {
        name: "Document 2",
        owner: "Zac",
        lastupdated: "2020-09-09"
    },
    {
        name: "Homework",
        owner: "John Doe",
        lastupdated: "2023-01-01"
    },
    {
        name: "Math paper",
        owner: "Abigail",
        lastupdated: "2023-03-03"
    },
    {
        name: "Accounting assignment",
        owner: "Me",
        lastupdated: "2022-02-02"
    },
    {
        name: "Report",
        owner: "Me",
        lastupdated: "2021-01-01"
    },
]
type Data = typeof documentData[0];
type SortKeys = keyof Data;
type SortOrder = "Ascending" | "Descending";
type Filter = "All" | "Me" | "Shared";


export default function DashboardTable() {
    const navigate = useNavigate();

    const [filter, setFilter] = useState<Filter>("All");
    const [sortKey, setSortKey] = useState<SortKeys>("name");
    const [sortDirection, setSortDirection] = useState<SortOrder>("Ascending");

    const sortedData = useCallback(()=>{
        console.log(sortKey, sortDirection)
        return documentData.sort((a, b) => {
            if (sortDirection === "Ascending") {
                if (a[sortKey] < b[sortKey]) {
                    return -1;
                }
                if (a[sortKey] > b[sortKey]) {
                    return 1;
                }
                return 0;
            } else {
                if (a[sortKey] > b[sortKey]) {
                    return -1;
                }
                if (a[sortKey] < b[sortKey]) {
                    return 1;
                }
                return 0;
            }
        })
    }
    , [sortKey, sortDirection])

    return(
        <>
            <div className="flex flex-row gap-2">
                <Tooltip text="Filter by" position="bottom">
                    <FilterButton label="All" onClick={()=> setFilter("All")}/>
                </Tooltip>
                <Tooltip text="Filter by" position="top">
                    <FilterButton label="Private" onClick={()=> setFilter("Me")}/>
                </Tooltip>
                <FilterButton label="Shared" onClick={()=> setFilter("Shared")}/>
                <PrimaryButton label="Upload PDF +" onClick={()=> uploadPDF()}></PrimaryButton>
            </div>
                <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-lg text-gray-500 dark:text-gray-400">
                        <tr>
                            <HeaderCell label="Name" setSortKey={setSortKey} setSortDirection={setSortDirection} sortDirection={sortDirection}/>
                            <HeaderCell label="Owner" setSortKey={setSortKey} setSortDirection={setSortDirection} sortDirection={sortDirection}/>
                            <HeaderCell label="Last updated" setSortKey={setSortKey} setSortDirection={setSortDirection} sortDirection={sortDirection}/>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedData().filter((document) => filter === "All" || document.owner === filter || filter === "Shared" && document.owner !== "Me")
                    .map((document, index) => (
                            <tr key={index} className="border-b-2 text-gray-800">
                                <td className="py-3 font-extrabold">
                                    <DocumentIcon className="w-5 h-5 inline-block mr-2"/>
                                    <button type="button" className="hover:underline" onClick={()=>navigate("/project-group-fearless-foxes/editor")}>{document.name}</button>
                                </td>
                                <td className="py-3">{document.owner}</td>
                                <td className="py-3">{document.lastupdated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

interface HeaderCellProps {
    label: string,
    setSortKey: any,
    setSortDirection: any,
    sortDirection: SortOrder,
}


const HeaderCell = ({label, setSortKey, setSortDirection, sortDirection}: HeaderCellProps ) => {
    return (
        <>  
            <th scope="col" className="py-3">
                <button type="button" onClick={() => { setSortKey(label.toLowerCase().replaceAll(" ","")); setSortDirection(sortDirection==="Ascending" ? "Descending": "Ascending")}} className="flex flex-row items-center gap-1">
                    <span>{label}</span>
                    <ArrowsUpDownIcon className="w-5 h-5"/>
                </button>
            </th>
        </>
    )
}


function uploadPDF() {
    console.log("Upload PDF")
}
