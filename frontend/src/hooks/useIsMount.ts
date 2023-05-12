import { useRef, useEffect } from 'react';

/**
 * Hook to detect initial mount / render.
 */
export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
        isMountRef.current = false;
    }, []);
    return isMountRef.current;
};