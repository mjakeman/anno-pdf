import React from 'react';
import PanTool from "./tools/PanTool";
import SelectTool from "./tools/SelectTool";
import PenTool from "./tools/PenTool";
import HighlighterTool from "./tools/HighlighterTool";
import RectangleTool from "./tools/RectangleTool";
import TextTool from "./tools/TextTool";
import MathTool from "./tools/MathTool";
import Undo from "./tools/Undo";
import Redo from "./tools/Redo";

export default function Toolbar() {

    return (
    <div className="bg-white dark:bg-anno-space-800 p-2 rounded-full flex items-center gap-2 drop-shadow-around w-min">
        <PanTool id={'pan'}/>
        <SelectTool id={'select'} />
        <PenTool id={'pen-1'}/>
        <PenTool id={'pen-2'}/>
        <HighlighterTool id={'highlighter'} />
        <TextTool id={'text'} />
        <MathTool id={'math'} />
        <RectangleTool id={'rect'} />
        <Undo/>
        <Redo/>
    </div>
    );
};

