"use client";

import React, { useEffect, useRef, useState } from "react";

interface KineticTitleProps {
    children: React.ReactNode;
    className?: string;
}

export default function KineticTitle({ children, className = "" }: KineticTitleProps) {
    const ref = useRef<HTMLHeadingElement>(null);
    const [weight, setWeight] = useState(400);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress based on vertical position
            const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / viewportHeight));

            // Map progress to font weight (400 to 900)
            const newWeight = 400 + Math.round(progress * 500);
            setWeight(newWeight);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <h2
            ref={ref}
            className={`font-secondary italic kinetic-scroll ${className}`}
            style={{ fontWeight: weight }}
        >
            {children}
        </h2>
    );
}
