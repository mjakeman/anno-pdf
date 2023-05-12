import * as pdfjs from "pdfjs-dist";
import {PDFDocumentProxy} from "pdfjs-dist";
import React, {useContext, useEffect, useRef, useState} from "react";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import PageRenderer from "./PageRenderer";
import SocketClient from "./socket/client";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {useToast} from "../../../hooks/useToast";
import {AnnoDocument} from "./Models";
import {RecentContext} from "../../../contexts/RecentContextProvider";
import {DocumentRecord} from "../dashboard/DashboardTable";

interface Props {
    onDocumentLoaded: () => void,
    document: AnnoDocument,
}

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentViewer({ onDocumentLoaded, document } : Props) {

    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
    const [pdfPages, setPdfPages] = useState<PDFPageProxy[]>([]);
    const {currentUser, firebaseUserRef} = useContext(AuthContext);

    const [pageLoaderCount, setPageLoaderCount] = useState<number>(0);
    const { addToBuffer } = useContext(RecentContext);

    const socketClient = useRef<SocketClient>(new SocketClient());

    const {addToast} = useToast();

    // (1) Startup
    useEffect(() => {
        if (!firebaseUserRef) return;
        loadDocument();
        let docRecord : DocumentRecord = {
            name: document.title,
            owner: document.owner.name,
            lastUpdated: document.updatedAt,
            uuid: document.uuid,
        };
        addToBuffer(docRecord);
    }, [currentUser]);

    // Load entire PDF
    function loadDocument() {
        if (!document) return; // if documentUuid isn't set
        if (!currentUser) return; // not logged in
        const loadingTask = pdfjs.getDocument({data: window.atob(document.base64File)});
        loadingTask.promise.then(function(pdf) {
            setPdfDocument(pdf);
        }).catch(error => {
            console.log(error)
            console.log(`couldn't load document`)
        });
    }

    let currentPage = 1;

    // (2) Once the document is loaded, start the chained async calls to load all the pages.
    useEffect(() => {
        const pdf = pdfDocument;
        if (!pdf) return;
        pdf.getPage(currentPage).then(function (page) {
            loadPages(page);
        });
    }, [pdfDocument]);

    // Chained Async calls to get an array of all the pages
    function loadPages(page : PDFPageProxy) {
        if (!pdfDocument) return;
        setPdfPages(oldPdfPages => {
            return [...oldPdfPages, page]
        })
        currentPage++;
        if (currentPage <= pdfDocument.numPages) {
            pdfDocument.getPage(currentPage).then(function (page) {
                loadPages(page);
            });
        }
    }


    useEffect(() => {

        const notify = (message: string) => {
            addToast({
                message: message,
                type: 'error'
            })
        }

        if (document && currentUser) {
            socketClient.current?.setup(currentUser.uid, document.uuid, notify);
        }

        return () => {
            socketClient.current?.teardown();
        }
    }, [currentUser]);


    function onPageLoaded(pageIndex: number) {
        if (pageIndex === pdfDocument!.numPages - 1) onDocumentLoaded();
    }


    return (
        <div className="w-full h-full overflow-y-auto bg-zinc-300 dark:bg-anno-space-700 ">
            <div className="grid gap-4 py-12 place-items-center">

                {/* Only start the page rendering once we have a full list of pages */}
                {pdfDocument && pdfPages.length === pdfDocument.numPages &&
                    pdfPages.map((page, index) => (
                        <PageRenderer onLoad={(pageIndex) => onPageLoaded(pageIndex)} doc={document} key={index} page={page} pageIndex={index} socketClientRef={socketClient} />
                    ))
                }
            </div>
        </div>
    )
}