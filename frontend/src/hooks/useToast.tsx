import {createContext, FC, ReactNode, RefObject, useContext, useState} from "react";
import Toast from "../components/Toast";
import {ToastContextType, ToastPoisition, toastPositionsMap, ToastProps} from "../types/ToastUtils";


export const ToastContext = createContext<ToastContextType>({
    addToast: () => {},
    remove: () => {},
    position: "bottom-right"
});

/**
 * A custom React hook that provides access to the ToastContext.
 * @returns An object containing the addToast and remove functions.
 */

export const useToast = () => useContext(ToastContext);

/**
 * A component that provides a ToastContext to its children.
 * 
 * Props:
 * - children: The child components to render.
 * 
 * State:
 * - toastList: An array of ToastProps objects representing the current list of toasts.
 * - position: The current toast position.
 * 
 * Functions:
 * - add: Adds a new toast to the list.
 * - remove: Removes a toast from the list.
 */

export const ToastProvider: FC <({children: ReactNode})> = ({children}) => {
    const [toastList, setToastList] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPoisition>("bottom-middle");

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
                <div className={"fixed z-[9999] w-screen max-w-xs m-3 "+toastPositionsMap[position] }>
                    {toastList.map((toast)=> (
                        <Toast key={toast.id} {...toast}/>
                    ))}
                </div>
            </ToastContext.Provider>
        </div>
    )
}