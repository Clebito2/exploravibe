"use client";

import type { Experience } from "@exploravibe/shared";
import ExperienceCard from "./ExperienceCard";

interface ExperienceGridProps {
    experiences: Experience[];
    title?: string;
}

export default function ExperienceGrid({ experiences, title }: ExperienceGridProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3 tracking-tighter">
                    <span className="w-1.5 h-8 bg-ocean-gradient rounded-full"></span>
                    {title}
                </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {experiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                ))}
            </div>
        </div>
    );
}
