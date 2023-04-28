import React from 'react';
import Eraser from "./tools/Eraser";
import Rectangle from "./tools/Rectangle";
import Pen from "./tools/Pen";
import Highlighter from "./tools/Highlighter";
import Text from "./tools/Text";
import Math from "./tools/Math";
import Pan from "./tools/Pan";
import Select from "./tools/Select";
import Undo from "./tools/Undo";
import Redo from "./tools/Redo";


export default function MeasurementToolbar() {

    return (
    <div className="bg-white dark:bg-anno-space-800 p-2 rounded-full flex items-center gap-2 drop-shadow-around w-min">
        <Pan id={'pan'}/>
        <Select id={'select'}/>
        <Pen id={'pen1'}/>
        <Pen id={'pen2'}/>
        <Highlighter id={'highlighter'} />
        <Text id={'text'} />
        <Math id={'math'}/>
        <Rectangle id={'rect'}/>
        <Eraser id={'eraser'}/>
        <Undo/>
        <Redo/>
    </div>
    );
};

