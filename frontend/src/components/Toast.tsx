import { useEffect } from "react";
import { useRef } from "react";
import { useToast } from "../hooks/useToast";
import { toastIconMap, toastPositionsMap, ToastProps, toastStylesMap } from "../types/ToastUtils";

export default function Toast(props: ToastProps) {
    let { id, message, type, duration, position } = props;
    if (duration === undefined) duration = 5000;
    if (position === undefined) position = 'bottom-right';
    const wrapperRef = useRef<HTMLDivElement>(null);
    const {remove} = useToast();

    const dismissRef = useRef<ReturnType<typeof setTimeout>>();
    
    useEffect(()=>{
        if(duration){
            dismissRef.current = setTimeout(()=>{
                remove(id,wrapperRef)
            }, duration)
        }
    })

    return (
        <div className={"flex rounded-md m-3 p-4 "+ toastStylesMap[type]} ref={wrapperRef}>
            <div className="flex flex-row gap-3">
                {toastIconMap[type]}
                {message}
            </div>

        </div>
    )
}
