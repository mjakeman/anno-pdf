import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import * as pdfjs from 'pdfjs-dist';
import {PDFDocumentProxy} from "pdfjs-dist";
import {PDFPageProxy} from "pdfjs-dist/types/src/display/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
    url: string;
    pageNumber: number;
}

const Viewer = React.memo(({ url, pageNumber }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
    const [pdfPage, setPdfPage] = useState<PDFPageProxy>();
    const pdfPageCanvas = useRef<HTMLCanvasElement | null>(null);

    const draw = () => {
        const canvas = canvasRef.current;

        if (!canvas) return;
        if (!pdfPage) return;
        if (!pdfPageCanvas.current) return;

        const ctx = canvas.getContext('2d')!;
        ctx.save();

        ctx.clearRect(0, 0, width, height);


        // Translate
        ctx.translate(docOffset.x, docOffset.y);

        // Draw page
        const pageCanvas = pdfPageCanvas.current!;
        ctx.drawImage(pageCanvas, 0, 0);

        ctx.restore();

        ctx.fillRect(0, 0, 20, 20);
    };

    const createCanvasForPage = async (page: PDFPageProxy) => {

        console.log("create canvas");

        const canvas = document.createElement('canvas');
        pdfPageCanvas.current = canvas;

        const scale = 1.0;
        const viewport = page.getViewport({ scale: scale, });

        // Support HiDPI-screens.
        const outputScale = window.devicePixelRatio || 1;

        const context = canvas.getContext('2d');

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        const renderContext = {
            canvasContext: context!,
            transform: transform!,
            viewport: viewport
        };

        console.log("render canvas");

        await page.render(renderContext).promise;

        return canvas;
    };

    // Only update on url change
    useEffect(() => {
        console.info("retrieving document");

        const loadingTask = pdfjs.getDocument(url);
        loadingTask.promise.then(function(pdf) {
            setPdfDocument(pdf);
        });
    }, [url]);

    // Only update on pdf document or page number change
    useEffect(() => {
        const pdf = pdfDocument;
        if (!pdf) return;

        console.info("retrieving page");

        pdf.getPage(pageNumber).then(function(page) {
            setPdfPage(page);
        });
    }, [pdfDocument, pageNumber]);

    // Recreate canvas when page changes
    useEffect(() => {
        if (!pdfPage) return;

        createCanvasForPage(pdfPage).then((canvas) => {
            console.log("Created new page of size:", canvas.width, canvas.height);
            requestAnimationFrame(draw);
        });
        return;
    }, [pdfPage]);

    // Regular drawing function
    useEffect(() => {
        const dpi = window.devicePixelRatio;

        function handleResize() {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = canvas.clientWidth * dpi;
            canvas.height = canvas.clientHeight * dpi;

            setWidth(canvas.width);
            setHeight(canvas.height);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);

    const [scale, setScale] = useState(1);

    // In world coords
    const [docOffset, setDocOffset] = useState({ x: 0, y: 0});

    // In mouse coords
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleWheel = (event: React.WheelEvent) => {
        const newScale = scale * (1 + event.deltaY / 1000);
        setScale(newScale);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dx = event.nativeEvent.offsetX - canvas.width / 2;
        const dy = event.nativeEvent.offsetY - canvas.height / 2;

        const oldOffset = mouseOffset;
        const newOffset = {
            x: oldOffset.x - dx * (newScale / scale - 1),
            y: oldOffset.y - dy * (newScale / scale - 1),
        };
        setMouseOffset(newOffset);

        draw();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setMouseOffset({x: e.clientX, y: e.clientY});
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (isDragging) {
            setMouseOffset({x: e.clientX, y: e.clientY});

            const deltaX = e.clientX - mouseOffset.x;
            const deltaY = e.clientY - mouseOffset.y;
            setDocOffset({x: docOffset.x + deltaX, y: docOffset.y + deltaY});

            requestAnimationFrame(draw);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        requestAnimationFrame(draw);
    })

    return <canvas
        className="w-full h-full"
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
    />;
});

export default Viewer;