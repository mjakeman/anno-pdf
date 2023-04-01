import React from 'react';
import {HandRaisedIcon} from "@heroicons/react/24/outline";
import {SunIcon} from "@heroicons/react/24/outline";
import {PencilIcon} from "@heroicons/react/24/outline";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import {ArrowUturnLeftIcon} from "@heroicons/react/24/outline";
import {ArrowUturnRightIcon} from "@heroicons/react/24/outline";
import { useState } from 'react';


interface MeasurementToolbarProps {
  onToolSelect: (tool: string) => void;
}

export default function MeasurementToolbar({ onToolSelect }:MeasurementToolbarProps) {  
  const [selectedTool, setSelectedTool ]= useState("");

  const tools = [
    { name: 'grab', icon: <HandRaisedIcon/> },
    { name: 'select', icon: <img src='./select_icon.svg'/> },
    { name: 'pencil1', icon: <PencilIcon/> },
    { name: 'pencil2', icon: <PencilIcon/> },
    { name: 'highlight', icon: <img src='./highlight_icon.svg'/> },
    { name: 'textbox', icon: <img src='./text_icon.svg'/> },
    { name: 'math', icon: <img src='./math_icon.svg'/> },
    { name: 'shape', icon: <img src='./rectangle_icon.svg'/> },
    { name: 'eraser', icon: <img src='./eraser_icon.svg'/> },
    { name: 'undo', icon: <ArrowUturnLeftIcon/> },
    { name: 'redo', icon: <ArrowUturnRightIcon/> },
];

  return (
    <div className="bg-white dark:bg-anno-space-800 p-2 rounded-full flex items-center gap-2 drop-shadow-around w-min">
      {tools.map((tool) => (
        <button
          key={tool.name}
          className={`hover:bg-gray-200 p-2 rounded-full transition-colors dark:hover:bg-anno-space-700 w-8 h-8 ${selectedTool==tool.name ? 'bg-gray-400 dark:bg-anno-space-100':'bg-white dark:bg-anno-space-800'}` }
          onClick={() => {onToolSelect(tool.name) ; setSelectedTool(tool.name)}}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};

