"use client";

interface SkeletonProps {
    className?: string;
    variant?: "circle" | "rect" | "text";
}

export default function Skeleton({ className = "", variant = "rect" }: SkeletonProps) {
    const baseClasses = "animate-pulse bg-crystal/20 border border-ocean/5";
    const variantClasses = {
        circle: "rounded-full",
        rect: "rounded-[2rem]",
        text: "rounded-lg h-4",
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            aria-hidden="true"
        />
    );
}
