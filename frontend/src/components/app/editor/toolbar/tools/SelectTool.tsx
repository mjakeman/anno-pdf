import {useContext, useEffect, useState} from "react";
import {ToolContext} from "../../Editor";
import Pan from "../model/tools/Pan";
import Select from "../model/tools/Select";

interface Props {
    id: string
}
export default function SelectTool({ id } : Props) {

    const [selectTool, setSelectTool] = useState<Select>(new Select(id));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);


    function handleClick() {
        setActiveToolData(selectTool);
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);


    return (
        <button onClick={handleClick} type="button" className={`${isActiveTool ? 'bg-gray-200 dark:bg-anno-space-900' : 'bg-white hover:bg-gray-200 dark:bg-anno-space-800 dark:hover:bg-anno-space-700'}  p-2 rounded-full transition-colors`}>
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_49_872)">
                    <g filter="url(#filter0_d_49_872)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.3301 13.6188C14.5978 13.4805 14.9239 13.529 15.1398 13.7393L18.3112 16.8283L21.4827 19.9172C21.6855 20.1148 21.7493 20.4151 21.6444 20.678C21.5396 20.941 21.2866 21.1149 21.0035 21.1186L19.0057 21.145L20.7347 24.4922C20.9122 24.8356 20.7775 25.2579 20.4341 25.4353C20.0906 25.6128 19.6683 25.4782 19.4909 25.1347L17.7618 21.7876L16.5844 23.4014C16.4175 23.6301 16.1293 23.7358 15.8541 23.6692C15.5789 23.6025 15.371 23.3767 15.3273 23.097L13.9598 14.3488C13.9132 14.0511 14.0624 13.7571 14.3301 13.6188Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.3301 13.6188C14.5978 13.4805 14.9239 13.529 15.1398 13.7393L18.3112 16.8283L21.4827 19.9172C21.6855 20.1148 21.7493 20.4151 21.6444 20.678C21.5396 20.941 21.2866 21.1149 21.0035 21.1186L19.0057 21.145L20.7347 24.4922C20.9122 24.8356 20.7775 25.2579 20.4341 25.4353C20.0906 25.6128 19.6683 25.4782 19.4909 25.1347L17.7618 21.7876L16.5844 23.4014C16.4175 23.6301 16.1293 23.7358 15.8541 23.6692C15.5789 23.6025 15.371 23.3767 15.3273 23.097L13.9598 14.3488C13.9132 14.0511 14.0624 13.7571 14.3301 13.6188Z" stroke="black" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <g filter="url(#filter1_d_49_872)">
                        <path d="M20.9996 16.5667V15.6334M9.09961 3.7334H7.69961C6.53981 3.7334 5.59961 4.6736 5.59961 5.8334V7.2334M17.4996 3.7334H18.8996C20.0594 3.7334 20.9996 4.6736 20.9996 5.8334V7.2334M9.09961 19.1334H7.69961C6.53981 19.1334 5.59961 18.1932 5.59961 17.0334V15.6334M11.4329 3.7334H15.1663M20.9996 9.56673V13.3001M5.59961 9.56673V13.3001M11.4329 19.1334H12.3663" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                </g>
                <defs>
                    <filter id="filter0_d_49_872" x="9.55176" y="9.14062" width="16.543" height="20.7734" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_49_872"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_49_872" result="shape"/>
                    </filter>
                    <filter id="filter1_d_49_872" x="0.849609" y="-1.0166" width="24.9004" height="24.9004" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_49_872"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_49_872" result="shape"/>
                    </filter>
                    <clipPath id="clip0_49_872">
                        <rect width="28" height="28" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </button>
    );
}