import React, {useRef} from 'react';

interface OverlayProps {
    onClick: (params: any) => any,
    children: React.ReactNode;
    position: OverlayChildPosition;
    twColor: string;
}

export enum OverlayChildPosition {
    LEFT = 'justify-start items-center',
    RIGHT = 'justify-end items-center',
    MIDDLE = 'justify-center items-center',
    TOP_LEFT = 'justify-start items-start',
    TOP_MIDDLE = 'justify-center items-start',
    TOP_RIGHT = 'justify-end items-start'
}

export default function Overlay ({ onClick, children, position, twColor } : OverlayProps) {

    const overlayRef = useRef<HTMLDivElement>(null);
    function onOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
        if (event.target === overlayRef.current)
            onClick(event);
    }

    return (
        <div ref={overlayRef} onClick={onOverlayClick} className={`fixed inset-0 bg-${twColor} bg-opacity-40 flex ${position}`}>
            {children}
        </div>
    );
}