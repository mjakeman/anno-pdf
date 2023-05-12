import { ReactNode, RefObject, useContext } from "react";
import { useState } from "react";
import { FC } from "react";
import { createContext } from "react";
import Toast from "../components/Toast";
import { ToastContextType, ToastPoisition, ToastProps } from "../types/ToastUtils";


export const ToastContext = createContext<ToastContextType>({
    addToast: () => {},
    remove: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: FC <({children: ReactNode})> = ({children}) => {
    const [toastList, setToastList] = useState<ToastProps[]>([]);

    const add = (toast: Omit<ToastProps, "id">) => {
        // Append toast to list 
        setToastList((toastList) => [...toastList, { ...toast, id: Math.random()*100000}]);
    }

    const remove = (toastId: number, ref: RefObject<HTMLDivElement>) => {
        setToastList((toastList)=> toastList.filter((toast)=> toast.id !==toastId))
    }




    return (
        <div className="">
            <ToastContext.Provider value={{addToast: add, remove}}>
                {children}
                <div className={"fixed z-[9999] w-screen max-w-xs m-3 bottom-0 left-1/2 transform -translate-x-1/2 right-1/2" }>
                    {toastList.map((toast)=> (
                        <Toast key={toast.id} {...toast}/>
                    ))}
                </div>
            </ToastContext.Provider>
        </div>
    )
}