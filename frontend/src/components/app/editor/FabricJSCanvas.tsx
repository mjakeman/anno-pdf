import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
export default function FabricJSCanvas() {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = new fabric.Canvas('fcanvas');
        const text = new fabric.Text('Hello, World!', { left: 50, top: 50, selectable: true });

        canvas.add(text);
        // add your canvas elements here
    }, []);

    return <canvas id="fcanvas" />;
};