import React, {useContext, useEffect} from "react";
import {fabric} from "fabric";
import {ToolContext} from "../components/app/editor/Editor";
import Pen from "../components/app/editor/toolbar/model/tools/Pen";
import Highlighter from "../components/app/editor/toolbar/model/tools/Highlighter";
import TextModel from "../components/app/editor/toolbar/model/tools/TextModel";
import Maths from "../components/app/editor/toolbar/model/tools/Maths";
import MathObject from "../components/app/editor/MathObject";

export default function useTools(canvas: any) {

    const [activeToolData, setActiveToolData] = useContext(ToolContext);

    useEffect(() => {
        if (canvas) {
            reset();
            switch (true) {
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
    function reset() {
        if (canvas) {
            canvas.isDrawingMode = false;
            canvas.off('mouse:down', drawText); // TODO: Not working?
            canvas.off('mouse:down', drawMath);
        }
    }
    function drawText (options: any) {
        if (canvas) {
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
    }
    function drawMath (options: any) {
        if (canvas) {
            if (options.target === null) {
                let text = new MathObject("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
                    left: options.e.offsetX,
                    top: options.e.offsetY,
                    scaleX: 4,
                    scaleY: 4,
                    height: 10,
                    width: 30,
                });
                canvas.add(text).setActiveObject(text);
            }
        }
    }


}