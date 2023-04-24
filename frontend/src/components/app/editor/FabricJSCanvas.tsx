import React, {useContext, useEffect, useRef} from 'react';
import {fabric} from 'fabric';
import CustomObject from "../../../CustomObject";
import {ToolContext} from "./Editor";

interface Props {
    width: number,
    height: number,
}

export default function FabricJSCanvas( {width, height} : Props ) {
    const canvasEl = useRef<HTMLCanvasElement>(null);


    const [selectedTool, setSelectedTool] = useContext(ToolContext);


    useEffect(() => {

        let canvas = new fabric.Canvas(canvasEl.current, {
            width: width,
            height: height,
            backgroundColor: 'white', // TODO REMOVE BG COLOR
        });

        function setPenDrawing() {

        }

        switch (selectedTool) {
            case "pan":
                console.log('yep, fab received pen');
                break;
            case "select":
                console.log('yep, fab received pen');
                break;
            case "pen1":
                console.log('yep, fab received pen');
                break;
            case "pen2":
                console.log('yep, fab received pen');
                break;
            case "text":
                console.log('yep, fab received pen');
                break;
            case "math":
                console.log('yep, fab received pen');
                break;
            case "rect":
                console.log('yep, fab received pen');
                break;
            case "eraser":
                console.log('yep, fab received pen');
                break;
        }
        // Examples of adding text...
        const text = new fabric.Textbox('Hello, World!',
            {
                left: 50,
                top: 50,
                selectable: true,
                width: 300, // TODO Change initial width,
            }
        );
        const customObj = new CustomObject("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
            left: 100,
            top: 100,
            scaleX: 4,
            scaleY: 4,
            height: 10,
            width: 30,
        });

        // // add your canvas elements here
        canvas.add(text);
        canvas.add(customObj);
        console.log(canvas.toObject());
    }, [selectedTool]);



    return (
        <canvas ref={canvasEl} />
    );
};

