import React from "react";

interface ContainerProps {
    children: React.ReactNode,
}
export default function Container({children} : ContainerProps) {
    return (
        <div className="container mx-auto p-4">
            {children}
        </div>
    );
}