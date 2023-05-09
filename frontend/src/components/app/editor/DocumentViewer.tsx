import * as pdfjs from "pdfjs-dist";
import React, {useContext, useEffect, useRef, useState} from "react";
import {PDFDocumentProxy} from "pdfjs-dist";
import {v4 as uuidv4} from "uuid";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import PageRenderer from "./PageRenderer";
import SocketClient from "./socket/client";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {AnnoDocument} from "./Models";


const server = import.meta.env.VITE_BACKEND_URL;

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

    const navigate = useNavigate();
    const socketClient = useRef<SocketClient>(new SocketClient());

    // (1) Startup
    useEffect(() => {
        if (!firebaseUserRef) return;
        loadDocument();
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
        if (document.uuid) {
            socketClient.current?.setup(uuidv4(), document.uuid);
        }

        return () => {
            socketClient.current?.teardown();
        }
    }, []);


    function onPageLoaded(pageIndex: number) {
        if (pageIndex === pdfDocument!.numPages - 1) onDocumentLoaded();
    }


    return (
        <div className="w-full h-full overflow-y-auto bg-zinc-300 dark:bg-anno-space-700 ">
            <div className="grid gap-4 py-12 place-items-center">

                {/* Only start the page rendering once we have a full list of pages */}
                {pdfDocument && pdfPages.length === pdfDocument.numPages &&
                    pdfPages.map((page, index) => (
                        <PageRenderer onLoad={(pageIndex)=> onPageLoaded(pageIndex)} key={index} page={page} pageIndex={index} socketClientRef={socketClient} />
                    ))
                }
            </div>
        </div>
    )
}