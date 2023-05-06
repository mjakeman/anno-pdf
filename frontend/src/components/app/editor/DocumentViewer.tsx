import * as pdfjs from "pdfjs-dist";
import React, {useContext, useEffect, useRef, useState} from "react";
import {UIEvent} from "react";
import {PDFDocumentProxy} from "pdfjs-dist";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import PageRenderer from "./PageRenderer";
import SocketClient from "./socket/client";
import Panzoom, {PanzoomObject} from '@panzoom/panzoom'
import {ZoomContext} from "./Editor";


const server = import.meta.env.VITE_BACKEND_URL;

interface Props {
    documentUuid: string,
}

// Required configuration option for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentViewer({ documentUuid } : Props) {

    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
    const [pdfPages, setPdfPages] = useState<PDFPageProxy[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const socketClient = useRef<SocketClient>(new SocketClient());


    // (1) Startup
    useEffect(() => {
        loadDocument();
    }, []);

    // Load entire PDF
    function loadDocument() {
        let filePath = "test.pdf"; // TODO: Make this an API call using documentUuid
        const loadingTask = pdfjs.getDocument(filePath);
        loadingTask.promise.then(function(pdf) {
            setPdfDocument(pdf);
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
        } else {
            // If currentPage is > numPages, then we have fully loaded.
            setIsLoaded(true);
        }
    }


    useEffect(() => {
        socketClient.current?.setup();

        return () => {
            socketClient.current?.teardown();
        }
    }, []);

    return (
        <div className="w-full h-full overflow-y-auto bg-zinc-300 dark:bg-anno-space-700 ">
            {isLoaded
                ?
                    <div className="grid gap-4 py-12 place-items-center">
                        {pdfPages.map((page, index) => (
                            <PageRenderer key={index} page={page} pageNumber={index} socketClientRef={socketClient} />
                        ))}
                    </div>
                :
                <div className="grid place-items-center h-full">
                    <svg className="animate-spin h-32 w-32 text-white" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </div>
            }
        </div>
    )
}