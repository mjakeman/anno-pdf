import React, {useContext, useEffect, useRef, useState} from 'react';
import {fabric} from 'fabric';
import MathObject from "./MathObject";
import {ToolContext} from "./Editor";
import Pen from "./toolbar/model/tools/Pen";
import Highlighter from "./toolbar/model/tools/Highlighter";
import TextModel from "./toolbar/model/tools/TextModel";
import Pan from "./toolbar/model/tools/Pan";
import Select from "./toolbar/model/tools/Select";
import Maths from "./toolbar/model/tools/Maths";
import {v4 as uuidv4} from "uuid";

interface Props {
    width: number,
    height: number,
}

export default function FabricJSCanvas( {width, height} : Props ) {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<any>(null);

    const [activeToolData, setActiveToolData] = useContext(ToolContext);

    // Setup Canvas
    useEffect(() => {
        let c = new fabric.Canvas(canvasEl.current, {
            width: width,
            height: height,
            backgroundColor: 'white', // TODO REMOVE BG COLOR
        });
        setCanvas(c);
    }, []);


    // Setup tool control.
    useEffect(() => {
        if (canvas) {

            reset();
            switch (true) {
                case activeToolData instanceof Pan:
                    canvas.on('mouse:down', pan);
                    break;
                case activeToolData instanceof Select:
                    canvas.selection = true;
                    break;
                case activeToolData instanceof Pen:
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.width = activeToolData.size;
                    canvas.freeDrawingBrush.color = activeToolData.color;
                    break;
                case activeToolData instanceof Highlighter:
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.width = activeToolData.size;
                    canvas.freeDrawingBrush.color = `${activeToolData.color}59`; // TODO: see https://stackoverflow.com/questions/23201134/transparent-argb-hex-value
                    break;
                case activeToolData instanceof TextModel:
                    canvas.on('mouse:down', drawText);
                    break;
                case activeToolData instanceof Maths:
                    canvas.on('mouse:down', drawMath);
                    break;
            }
        }

    }, [activeToolData]);

    // TODO: Double check
    function pan(options: any) {
        canvas.isDragging = true;
        canvas.selection = false;
        canvas.lastPosX = options.e.clientX;
        canvas.lastPosY = options.e.clientY;
    }

    function select() {

    }

    function drawText (options: any) {
        if (options.target === null) {
            let text = new fabric.IText('', { left: options.e.offsetX, top: options.e.offsetY });
            canvas.add(text).setActiveObject(text);
            text.on('editing:exited', () => {
                if (text.text?.length === 0) {
                    canvas.remove(text);
                }
            });
            text.enterEditing();
        }
    }
    function drawMath (options: any) {
        if (options.target === null) {
            let text = new MathObject("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
                left: options.e.offsetX,
                top:  options.e.offsetY,
                scaleX: 4,
                scaleY: 4,
                height: 10,
                width: 30,
            });
            canvas.add(text).setActiveObject(text);
        }
    }

    function reset() {
        canvas.__eventListeners = {};

        canvas.selection = false;
        canvas.isDragging = false;
        canvas.off('mouse:down', drawText);
        canvas.off('mouse:down', drawMath);
        canvas.off('mouse:down', pan);
        canvas.isDrawingMode = false;
    }

    return (
        <canvas ref={canvasEl} />
    );
};

