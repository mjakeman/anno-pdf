import {ReactNode, RefObject} from "react";
import {ExclamationCircleIcon, InformationCircleIcon} from "@heroicons/react/24/solid";
import {CheckIcon} from "@heroicons/react/20/solid";

/**
 * Provides utility functions and types for toast component.
 *  
 * */

export type ToastProps = {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
    position?: ToastPoisition;
}

export type ToastPoisition = | "top-right" |  'bottom-right' | 'bottom-left' | 'top-left' | 'bottom-middle';

export type RequiredToastProps = Required<ToastProps>;

export const toastStylesMap: Record<RequiredToastProps['type'], string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
};

export const toastPositionsMap: Record<RequiredToastProps['position'], string> = {
    "top-right": "top-0 right-1",
    "bottom-right": "bottom-0 right-1",
    "bottom-left": "bottom-0 left-1",
    "top-left": "top-0 left-1",
    "bottom-middle" : "bottom-0 left-1/2 transform -translate-x-1/2 right-1/2",
};

export const toastIconMap: Record<RequiredToastProps['type'], ReactNode> = {
    success: <CheckIcon className="w-5 h-5"/>,
    info: <InformationCircleIcon className="w-5 h-5"/>,
    error: <ExclamationCircleIcon className="w-5 h-5"/>
}


export type ToastContextType = {
    addToast: (toast: Omit<ToastProps, "id">) => void;
    remove: (toastId: number, ref: RefObject<HTMLDivElement>) => void;
    position: ToastPoisition;
}

