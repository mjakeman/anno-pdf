import { useEffect, useState } from "react";
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

    const progressRef = useRef<ReturnType<typeof setInterval>>();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const finished = 100;

        if (duration) {
            progressRef.current = setInterval(()=>{
                if(progress < finished){
                    setProgress((previousValue) => previousValue+1);
                }else{return}
            }, duration/finished)
        }
        return () => {
            clearInterval(progressRef.current)
        }
    },[])



    return (
        <div className={"flex rounded-md p-4 my-3 "+ toastStylesMap[type]} ref={wrapperRef}>
                {!!duration && (
                <div className="absolute bottom-3 right-0 left-0 w-full h-1 bg-neutral-100 rounded-md">
                    <span className="absolute bg-neutral-300 right-0 top-0 bottom-0 h-full rounded-md"
                    style={{width: `${progress}%`}}
                    /> 
                </div>

            )}
            <div className="flex flex-row gap-3">
                {toastIconMap[type]}
                {message}
            </div>
        

        </div>
    )
}
