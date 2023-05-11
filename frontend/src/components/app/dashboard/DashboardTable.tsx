import {useCallback, useContext, useEffect, useState} from "react";
import PrimaryButton from "../../PrimaryButton";
import FilterButton from "./FilterButton";
import {ArrowsUpDownIcon, UserGroupIcon, UserIcon} from "@heroicons/react/24/outline";
import {DocumentIcon} from "@heroicons/react/24/solid";
import {useNavigate} from "react-router-dom";
import Tooltip from "../../Tooltip";
import FileUploadModal from "./FileUploadModal";
import { AuthContext } from "../../../contexts/AuthContextProvider";
import {RecentContext} from "../../../contexts/RecentContextProvider";
import moment from "moment";


export interface DocumentRecord {
    name: string,
    owner: string,
    lastUpdated: string,
    uuid: string,
}

interface Props {
    documentData: DocumentRecord[]
}

type SortKeys = "name" | "owner" | "lastUpdated";
type SortOrder = "Ascending" | "Descending";
type Filter = "All" | "Me" | "Shared";


export default function DashboardTable({documentData} : Props) {

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
    , [sortKey, sortDirection]);

    function handleDocumentClicked(document: DocumentRecord) {
        navigate(`/document/${document.uuid}`);
    }

    function formatLastUpdated(dateUTC: string) {
        const localDate = moment.utc(dateUTC).local();
        const formattedDate = localDate.format('D MMM YYYY [at] h:mm A');
        return `${formattedDate}`;
    }

    return(
        <>  
            <FileUploadModal isVisible={isUploadModalOpen} onOutsideClick={()=>setIsUploadModalOpen(false)}/>
            <div className="flex flex-row gap-2">
                <Tooltip text="Filter by" position="bottom">
                    <FilterButton label="All" onClick={()=> setFilter("All")} isSelected={filter==="All"}/>
                </Tooltip>
                <Tooltip text="Filter by" position="top">
                    <FilterButton label="My Documents" icon={<UserIcon className="w-6 h-6 stroke-2" />} onClick={()=> setFilter("Me")} isSelected={filter==="Me"}/>
                </Tooltip>
                <FilterButton label="Shared With Me" icon={<UserGroupIcon className="w-6 h-6 stroke-2" />} onClick={()=> setFilter("Shared")} isSelected={filter==="Shared"}/>
                <PrimaryButton label="Upload PDF +" onClick={()=> setIsUploadModalOpen(true)}></PrimaryButton>
            </div>
                <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
                    <thead className="text-lg text-gray-500 dark:text-gray-200">
                        <tr>
                            <HeaderCell label="Name" setSortKey={setSortKey} sortKey={"name"} setSortDirection={setSortDirection} sortDirection={sortDirection} isSelected={sortKey==="name"}/>
                            <HeaderCell label="Owner" setSortKey={setSortKey} sortKey={"owner"} setSortDirection={setSortDirection} sortDirection={sortDirection} isSelected={sortKey==="owner"}/>
                            <HeaderCell label="Last updated" setSortKey={setSortKey} sortKey={"lastUpdated"} setSortDirection={setSortDirection} sortDirection={sortDirection} isSelected={sortKey==="lastUpdated"}/>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedData().filter((document) => filter === "All" || document.owner === filter || filter === "Shared" && document.owner !== "Me")
                    .map((document, index) => (
                            <tr key={index} className="border-b-2 text-gray-800 dark:text-white">
                                <td className="py-3">
                                    <Tooltip text={document.name} position="top">
                                        <DocumentIcon className="w-5 h-5 inline-block mr-2"/>
                                            <button type="button" className="font-extrabold hover:underline" onClick={() =>  handleDocumentClicked(document)}>{document.name}</button>
                                    </Tooltip>
                                </td>
                                <td className="py-3">{document.owner}</td>
                                <td className="py-3">{formatLastUpdated(document.lastUpdated)}</td>
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
    sortKey: SortKeys,
    setSortDirection: any,
    sortDirection: SortOrder,
    isSelected?: boolean
}

const selectedStyle = "text-gray-900 dark:text-gray-200";


const HeaderCell = ({label, sortKey, setSortKey, setSortDirection, sortDirection, isSelected}: HeaderCellProps ) => {

    return (
        <>  
            <th scope="col" className="py-3">
                <button type="button" onClick={() => { setSortKey(sortKey); setSortDirection(sortDirection==="Ascending" ? "Descending": "Ascending")}} className={`flex flex-row items-center gap-1 ${isSelected ? selectedStyle : ''}` }>
                    <span>{label}</span>
                    <ArrowsUpDownIcon className="w-5 h-5"/>
                </button>
            </th>
        </>
    )
}
