import React from 'react';
import PanTool from "./tools/PanTool";
import SelectTool from "./tools/SelectTool";
import PenTool from "./tools/PenTool";
import HighlighterTool from "./tools/HighlighterTool";
import RectangleTool from "./tools/RectangleTool";
import TextTool from "./tools/TextTool";
import MathTool from "./tools/MathTool";
import Tooltip from "../../../Tooltip";

export default function Toolbar() {

    return (
    <div className="bg-white dark:bg-anno-space-800 p-2 rounded-full flex items-center gap-2 drop-shadow-around w-min">
        <Tooltip text="Select" position="bottom">
            <SelectTool id={'select'} />
        </Tooltip>
        <Tooltip text="Pen" position="bottom">
            <PenTool id={'pen-1'}/>
        </Tooltip>
        <Tooltip text="Pen" position="bottom">
            <PenTool id={'pen-2'}/>
        </Tooltip>
        <Tooltip text="Highlighter" position="bottom">
            <HighlighterTool id={'highlighter'} />
        </Tooltip>
        <Tooltip text="Text" position="bottom">
            <TextTool id={'text'} />
        </Tooltip>
        <Tooltip text="Equation" position="bottom">
            <MathTool id={'math'} />
        </Tooltip>
        <Tooltip text="Rectangle" position="bottom">
            <RectangleTool id={'rect'} />
        </Tooltip>
    </div>
    );
};

