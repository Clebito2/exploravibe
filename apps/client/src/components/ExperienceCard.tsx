"use client";

import type { Experience } from "@exploravibe/shared";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
    experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 premium-card group h-full flex flex-col">
            <div className="h-72 relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-coral/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black text-white shadow-xl z-10 uppercase tracking-[0.2em] translate-y-0 group-hover:-translate-y-1 transition-transform">
                    {experience.location?.city || "Explora"}
                </div>
                <img
                    src={experience.images[0]}
                    alt={experience.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-coral uppercase tracking-[0.3em]">
                        {experience.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="flex items-center gap-1.5 text-ocean text-[11px] font-black">
                        <span className="text-amber-500">★</span> {experience.rating || "0.0"}
                    </span>
                </div>

                <h4 className="text-3xl font-secondary italic text-ocean mb-4 tracking-tight group-hover:text-coral transition-colors duration-300">
                    {experience.title}
                </h4>

                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-primary font-medium">
                    {experience.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Valor Elite</span>
                        <span className="text-2xl font-black text-ocean">R$ {experience.price}</span>
                    </div>

                    <Link
                        to={`/experiencia/${experience.id}`}
                        className="p-4 bg-crystal text-ocean hover:bg-ocean hover:text-white transition-all duration-500 rounded-2xl active:scale-95 group/btn"
                    >
                        <svg className="w-6 h-6 transform group-hover/btn:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
