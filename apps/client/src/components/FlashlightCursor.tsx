"use client";

import { useEffect, useState } from "react";

export default function FlashlightCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isVisible]);

    if (typeof window !== "undefined" && window.innerWidth < 768) return null;

    return (
        <div
            className="flashlight-glow fixed inset-0 pointer-events-none transition-opacity duration-500"
            style={{
                left: position.x,
                top: position.y,
                opacity: isVisible ? 1 : 0
            }}
        />
    );
}
