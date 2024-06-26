import React from 'react';
import SelectTool from "./tools/SelectTool";
import PenTool from "./tools/PenTool";
import HighlighterTool from "./tools/HighlighterTool";
import RectangleTool from "./tools/RectangleTool";
import TextTool from "./tools/TextTool";
import Tooltip from "../../../Tooltip";
import ClearAllButton from "./tools/ClearAllButton";

export default function Toolbar() {

    return (
    <div className="bg-white dark:bg-anno-space-800 p-2 rounded-full flex items-center gap-2 drop-shadow-around w-min">
        <Tooltip text="Select" position="bottom">
            <SelectTool id={'select'} />
        </Tooltip>
        <span className="h-10 border border-l-2 border-zinc-400 rounded-full dark:border-white translate-x-1/2 mx-2"></span>
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
        <Tooltip text="Rectangle" position="bottom">
            <RectangleTool id={'rect'} />
        </Tooltip>
        <span className="h-10 border border-l-2 border-zinc-400 rounded-full dark:border-white translate-x-1/2 mx-2"></span>
        <Tooltip text="Clear Annotations" position="bottom">
            <ClearAllButton />
        </Tooltip>
    </div>
    );
};

