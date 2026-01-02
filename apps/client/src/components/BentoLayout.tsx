"use client";

import React from "react";

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 ${className}`}>
            {children}
        </div>
    );
}

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    span?: "small" | "medium" | "large" | "full";
    onClick?: () => void;
}

export function BentoCard({ children, className = "", span = "small", onClick }: BentoCardProps) {
    const spans = {
        small: "md:col-span-1 md:row-span-1",
        medium: "md:col-span-2 md:row-span-1",
        large: "md:col-span-2 md:row-span-2",
        full: "md:col-span-4 md:row-span-1"
    };

    // Check if a custom background is provided to avoid glass-morphism override
    const hasCustomBg = className.includes("bg-") || className.includes("!bg-");
    const baseClasses = hasCustomBg ? "" : "glass-morphism";

    return (
        <div
            onClick={onClick}
            className={`${baseClasses} rounded-[2.5rem] p-8 premium-card flashlight-area ${spans[span]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
