import React from 'react';
import {HandRaisedIcon} from "@heroicons/react/24/outline";
import {SunIcon} from "@heroicons/react/24/outline";
import {PencilIcon} from "@heroicons/react/24/outline";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import {ArrowUturnLeftIcon} from "@heroicons/react/24/outline";
import {ArrowUturnRightIcon} from "@heroicons/react/24/outline";


interface MeasurementToolbarProps {
  onToolSelect: (tool: string) => void;
}

const MeasurementToolbar: React.FC<MeasurementToolbarProps> = ({ onToolSelect }) => {
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
    <div className="bg-white dark:bg-anno-space-800 p-2 rounded-full flex items-center gap-2 shadow-xl w-min">
      {tools.map((tool) => (
        <button
          key={tool.name}
          className="bg-white hover:bg-gray-200 dark:bg-anno-space-800 p-2 rounded-full transition-colors dark:hover:bg-blue-800 w-8 h-8"
          onClick={() => onToolSelect(tool.name)}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};

export default MeasurementToolbar;