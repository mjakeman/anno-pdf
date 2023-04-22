import React, {useEffect, useRef} from 'react';
import { fabric } from 'fabric';
import CustomObject from "../../../CustomObject";

interface Props {
    width: number,
    height: number,
}

export default function FabricJSCanvas( {width, height} : Props ) {
    const canvasEl = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasEl.current, {
            width: width,
            height:height,
            backgroundColor: 'white', // TODO REMOVE BG COLOR
        });
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
    }, []);

    return (
        <canvas ref={canvasEl} />
    );
};

