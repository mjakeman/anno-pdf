import { ReactNode, RefObject, useContext } from "react";
import { useState } from "react";
import { FC } from "react";
import { createContext } from "react";
import Toast from "../components/Toast";
import { ToastContextType, ToastPoisition, toastPositionsMap, ToastProps } from "../types/ToastUtils";


export const ToastContext = createContext<ToastContextType>({
    addToast: () => {},
    remove: () => {},
    position: "bottom-right"
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: FC <({children: ReactNode})> = ({children}) => {
    const [toastList, setToastList] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPoisition>("bottom-right");

    const add = (toast: Omit<ToastProps, "id">) => {
        if(toast.position){
            setPosition(toast.position)
        }
        // Append toast to list 
        setToastList((toastList) => [...toastList, { ...toast, id: Math.random()*100000}]);
    }

    const remove = (toastId: number, ref: RefObject<HTMLDivElement>) => {
        setToastList((toastList)=> toastList.filter((toast)=> toast.id !==toastId))
    }




    return (
        <div className="">
            <ToastContext.Provider value={{addToast: add, remove, position}}>
                {children}
                <div className={"fixed z-9999 w-screen max-w-xs m-3 "+toastPositionsMap[position] }>
                    {toastList.map((toast)=> (
                        <Toast key={toast.id} {...toast}/>
                    ))}
                </div>
            </ToastContext.Provider>
        </div>
    )
}