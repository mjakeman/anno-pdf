import ActionMenu from "./ActionMenu";
import Fullscreen from "./Fullscreen";
import ActiveUserBubbles from "./ActiveUserBubbles";
import PrimaryButton from "../../../PrimaryButton";
import {UserPlusIcon} from "@heroicons/react/24/outline";
import SharePopup from "../../share/popup/SharePopup";
import React, {useContext, useState} from "react";
import Logo from "../../../Logo";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../../../../contexts/AuthContextProvider";
import {useToast} from "../../../../hooks/useToast";
import {DocumentContext} from "../Editor";
import {AnnoDocument} from "../Models";
import moment from "moment";
import Tooltip from "../../../Tooltip";
import * as jspdf from "jspdf";

interface Props {
    annoDocument: AnnoDocument,
}

export default function EditorHeader({ annoDocument } : Props) {
    const {firebaseUserRef} = useContext(AuthContext);
    let  { documentUuid } = useParams();
    const {addToast} = useToast();

    const navigate = useNavigate();
    const [activeUsers] = useContext(DocumentContext);
    const {currentUser} = useContext(AuthContext);

    function formatLastUpdated(dateUTC: string) {
        const localDate = moment.utc(dateUTC).local();
        const formattedDate = localDate.format('D MMM YYYY [at] h:mm A');
        return `Last Updated ${formattedDate}`;
    }

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    async function inviteUser(email: string){
        let token = await firebaseUserRef!.getIdToken();
        const bodyParams = {
            "email": email}
        await axios.post(import.meta.env.VITE_BACKEND_URL + '/documents/' +documentUuid + '/share', bodyParams, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if(response.status==200){
                addToast({
                    message: 'User invited successfully',
                    type: 'success'
                })
            }
        }
        ).catch((error) => {
            console.log(error);
            addToast({
                
                message: 'User invite failed',
                type: 'error'
            })
        });
    }

    // Inspiration:
    // https://github.com/RavishaHesh/PDFJsAnnotations/blob/master/pdfannotate.js
    async function exportDocument() {
        const pages = annoDocument.pages;
        console.log(pages);

        const firstPage = pages[0];

        const format = [firstPage.getWidth(), firstPage.getHeight()];
        const orientation = "portrait";

        let doc = new jspdf.jsPDF({
            unit: "px",
            format,
            orientation
        });

        pages.forEach((page, index) => {
            if (index != 0) {
                doc.addPage([page.getWidth(), page.getHeight()], orientation);
                doc.setPage(index + 1);
            }

            doc.addImage(
                page.toDataURL({
                    format: 'png',
                }),
                'png',
                0,
                0,
                page.getWidth(),
                page.getHeight(),
                `page-${index + 1}`,
                'NONE',
                0
            );
        });

        doc.save(`${annoDocument.title}.pdf`);
    }

    async function deleteDocument() {
        let token = await firebaseUserRef!.getIdToken();

        await axios.delete(import.meta.env.VITE_BACKEND_URL + '/documents/' + documentUuid + '/delete', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
                if(response.status==200){

                    navigate('/');

                    addToast({
                        
                        message: 'Document deleted successfully',
                        type: 'success'
                    })
                }
            }
        ).catch((error) => {
            console.log(error);
            addToast({
                
                message: 'Document deletion failed',
                type: 'error'
            })
        });
    }

    function fullScreenClick() {
        const elem = document.documentElement;
        if (fullScreen) {
            document.exitFullscreen();
            setFullScreen(false);
        } else {
            elem.requestFullscreen();
            setFullScreen(true);
        }
    }

    async function copyDocument(){
        addToast({
            message: 'Copying document...',
            type: 'info'
        })
        let token = await firebaseUserRef!.getIdToken();

        await axios.post(import.meta.env.VITE_BACKEND_URL + '/documents/' +documentUuid + '/copy', null,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if(response.data){
                addToast({
                    message: 'Document copied successfully',
                    type: 'success'
                })
                window.open('/document/' + response.data.uuid, '_blank')
            }
        }
        ).catch((error) => {
            addToast({
                message: 'Document copy failed',
                type: 'error'
            })
        });
    }

    return (
        <header className="bg-white dark:bg-anno-space-900 border-b-[1px] border-zinc-400 dark:border-anno-space-100 w-full flex flex-row items-center justify-between px-4 py-2 dark:bg-anno-space-700">

            {/* Left side */}
            <div className="flex flex-row items-center justify-between gap-4">

                {/* Logo */}
                <Tooltip text="Back" position="bottom">
                    <Logo className="w-8 h-8 hover:cursor-pointer" onClick={()=>navigate("/dash")}/>
                </Tooltip>

                {/* Document details */}
                <div className="flex flex-col justify-start">
                    {/* TODO: add edit function*/}
                    <Tooltip text={annoDocument.title} position="bottom">
                        <h1 className="truncate max-w-sm text-lg font-bold text-anno-red-primary dark:text-anno-pink-500 self-start">
                            {annoDocument.title}
                        </h1>
                    </Tooltip>
                    <p className="text-xs text-neutral-400 dark:text-white font-light self-start">
                        {formatLastUpdated(annoDocument.updatedAt)}
                    </p>
                </div>

                <ActionMenu onCopy={() => copyDocument()} onDelete={() => deleteDocument()} onDownload={() => exportDocument()} annoDoc={annoDocument}/>

            </div>

            {/* Right Side */}
            <div className="flex flex-row items-center justify-between gap-2">

                <Tooltip text="Fullscreen" position="bottom">
                    <Fullscreen onClick={() => fullScreenClick()}/>
                </Tooltip>

                {/* Active Users */}
                <ActiveUserBubbles activeUsers={[currentUser, ...activeUsers]} />

                {/* Share button*/}
                <div className="relative">

                    <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => setShowSharePopup(true)}/>

                    <span className={`absolute mt-2 z-50 right-0 ${!showSharePopup ? "hidden" : "block"} `}>
                        <SharePopup annoDocument={annoDocument} owner={annoDocument.owner} onOutsideClick={() => setShowSharePopup(false)} onSharePress={(email) => inviteUser(email)} peopleSharedWith={[...annoDocument.sharedWith, annoDocument.owner]}/>
                    </span>

                </div>
            </div>

        </header>
    );
}