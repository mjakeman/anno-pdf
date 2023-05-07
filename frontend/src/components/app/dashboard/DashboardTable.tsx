import {useCallback, useContext, useState} from "react";
import PrimaryButton from "../../PrimaryButton";
import FilterButton from "./FilterButton";
import {ArrowsUpDownIcon} from "@heroicons/react/24/outline";
import {DocumentIcon} from "@heroicons/react/24/solid";
import {useNavigate} from "react-router-dom";
import Tooltip from "../../Tooltip";
import FileUploadModal from "./FileUploadModal";
import { AuthContext } from "../../../contexts/AuthContextProvider";


export interface DocumentRecord {
    name: string,
    owner: string,
    lastupdated: string,
    uuid: string,
}

interface Props {
    documentData: DocumentRecord[]
}

type SortKeys = "name" | "owner" | "lastupdated";
type SortOrder = "Ascending" | "Descending";
type Filter = "All" | "Me" | "Shared";


export default function DashboardTable({documentData} : Props) {
    const {currentUser} = useContext(AuthContext);

    const navigate = useNavigate();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const [filter, setFilter] = useState<Filter>("All");
    const [sortKey, setSortKey] = useState<SortKeys>("name");
    const [sortDirection, setSortDirection] = useState<SortOrder>("Ascending");

    const sortedData = useCallback(()=>{
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
            <FileUploadModal isVisible={isUploadModalOpen} onOutsideClick={()=>setIsUploadModalOpen(false)}/>
            <div className="flex flex-row gap-2">
                <Tooltip text="Filter by" position="bottom">
                    <FilterButton label="All" onClick={()=> setFilter("All")} isSelected={filter==="All"}/>
                </Tooltip>
                <Tooltip text="Filter by" position="top">
                    <FilterButton label="Private" onClick={()=> setFilter("Me")} isSelected={filter==="Me"}/>
                </Tooltip>
                <FilterButton label="Shared" onClick={()=> setFilter("Shared")} isSelected={filter==="Shared"}/>
                <PrimaryButton label="Upload PDF +" onClick={()=> setIsUploadModalOpen(true)}></PrimaryButton>
            </div>
                <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
                    <thead className="text-lg text-gray-500 dark:text-gray-200">
                        <tr>
                            <HeaderCell label="Name" setSortKey={setSortKey} setSortDirection={setSortDirection} sortDirection={sortDirection}/>
                            <HeaderCell label="Owner" setSortKey={setSortKey} setSortDirection={setSortDirection} sortDirection={sortDirection}/>
                            <HeaderCell label="Last updated" setSortKey={setSortKey} setSortDirection={setSortDirection} sortDirection={sortDirection}/>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedData().filter((document) => filter === "All" || document.owner === "Me" || filter === "Shared" && document.owner !== "Me")
                    .map((document, index) => (
                            <tr key={index} className="border-b-2 text-gray-800 dark:text-white">
                                <td className="py-3 font-extrabold">
                                    <DocumentIcon className="w-5 h-5 inline-block mr-2"/>
                                    <button type="button" className="hover:underline" onClick={()=>navigate(`/document/${document.uuid}`)}>{document.name}</button>
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
