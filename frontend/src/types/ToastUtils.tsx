import { ReactNode, RefObject } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

export type ToastProps = {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
    position?: ToastPoisition;
}

export type ToastPoisition = | "top-right" |  'bottom-right' | 'bottom-left' | 'top-left';

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
};

export const toastIconMap: Record<RequiredToastProps['type'], ReactNode> = {
    success: <CheckIcon className="w-5 h-5"/>,
    info: <InformationCircleIcon className="w-5 h-5"/>,
    error: <ExclamationCircleIcon className="w-5 h-5"/>
}


export type ToastContextType = {
    add: (toast: Omit<ToastProps, "id">) => void;
    remove: (toastId: number, ref: RefObject<HTMLDivElement>) => void;
    position: ToastPoisition;
}

