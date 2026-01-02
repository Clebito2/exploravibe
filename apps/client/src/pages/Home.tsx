import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Experience } from "@exploravibe/shared";
import Header from "@/components/Header";
import { useAuth } from "@/lib/AuthContext";
import { useExperiences } from "@/lib/useExperiences";
import { BentoGrid, BentoCard } from "@/components/BentoLayout";
import KineticTitle from "@/components/KineticTitle";
import FlashlightCursor from "@/components/FlashlightCursor";
import ExperienceCard from "@/components/ExperienceCard";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import { CATEGORIES } from "@/lib/constants";

export default function Home() {
    const { experiences, loading } = useExperiences();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    // Invisible AI Logic: Sort by Interest Match
    const getMatchScore = (experience: Experience) => {
        if (!user?.preferences || !user.consent?.personalization) return 0;

        let score = 0;
        if (user.preferences.interests.includes(experience.category)) score += 50;
        if (user.preferences.travelStyle === "aventureiro" && experience.category === "Aventura") score += 30;
        if (user.preferences.travelStyle === "cultural" && experience.category === "Cultura") score += 30;
        if (user.preferences.travelStyle === "festivo" && experience.category === "Lazer") score += 20;

        return score;
    };

    const filteredExperiences = experiences
        .filter((exp) => {
            if (selectedCategory === "Todos") return true;
            if (selectedCategory === "João Pessoa" || selectedCategory === "Goiânia") {
                return exp.location.city === selectedCategory;
            }
            return exp.category === selectedCategory;
        })
        .sort((a, b) => getMatchScore(b) - getMatchScore(a));

    return (
        <main className="min-h-screen bg-white selection:bg-crystal selection:text-ocean overflow-x-hidden">
            <FlashlightCursor />
            <Header />

            {/* Hero Section - The Asymmetric Entry */}
            <section className="pt-32 pb-16 px-6 max-w-[1600px] mx-auto">
                <BentoGrid>
                    {/* Main Hero Card */}
                    <BentoCard span="large" className="bg-ocean text-white border-none flex flex-col justify-end p-12 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-ocean/50 to-black/40 z-0"></div>
                        {/* Optimized Hero Image with fetchPriority and eager loading */}
                        <img
                            src="https://images.unsplash.com/photo-1540200049848-d9813ea0e120?q=80&w=1600&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition duration-1000"
                            alt="Elite Travel"
                            fetchPriority="high"
                            loading="eager"
                        />
                        <div className="relative z-10">
                            <KineticTitle className="text-5xl md:text-8xl mb-6 leading-[0.9] tracking-tighter">
                                Sinta a <br />Singularidade.
                            </KineticTitle>
                            <p className="text-xl text-cyan-50/80 font-primary max-w-md mb-8">
                                Curadoria de elite para quem busca o extraordinário em João Pessoa e Goiânia.
                            </p>
                            <button
                                onClick={() => navigate("/perfil")}
                                className="px-10 py-5 bg-coral text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:shadow-[0_0_30px_rgba(255,111,0,0.4)] transition-all active:scale-95"
                            >
                                Personalizar Minha Vibe
                            </button>
                        </div>
                    </BentoCard>

                    {/* Dica Local / Status Card */}
                    <BentoCard span="medium" className="bg-crystal flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ocean/40 mb-4 block">Dashboard de Vibe</span>
                            <h3 className="text-3xl font-secondary italic text-ocean leading-tight">
                                {user?.preferences?.interests?.length
                                    ? `Sua paixão por ${user.preferences.interests[0]} nos guiou até aqui.`
                                    : "Descubra sua próxima frequência vibracional."}
                            </h3>
                        </div>
                        {user && (
                            <div className="flex items-center gap-4 p-4 bg-white/40 rounded-3xl border border-white/60">
                                <div className="w-12 h-12 rounded-2xl bg-ocean flex items-center justify-center text-white font-black">
                                    {user.displayName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-ocean">Membro Elite</p>
                                    <p className="text-sm font-bold text-ocean/60">{user.displayName}</p>
                                </div>
                            </div>
                        )}
                    </BentoCard>

                    {/* Quick Stat / Utility Card */}
                    <BentoCard span="small" className="bg-white flex flex-col items-center justify-center text-center">
                        <div className="p-5 rounded-full bg-coral/10 text-coral mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-black text-ocean mb-1">2026</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ocean/40">UX Vision</p>
                    </BentoCard>

                    {/* Secondary CTA Card */}
                    <BentoCard span="small" className="!bg-ocean flex flex-col justify-between group cursor-pointer border-none" onClick={() => navigate("/viagens")}>
                        <div className="text-white">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Vibe Bag</p>
                            <h4 className="text-2xl font-black leading-none uppercase">Meus <br />Roteiros</h4>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-ocean transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </BentoCard>
                </BentoGrid>
            </section>

            {/* Filters with Sticky Hierarchy */}
            <section className="px-6 py-8 sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-y border-slate-100">
                <div className="max-w-[1600px] mx-auto">
                    <FilterBar
                        categories={CATEGORIES}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>
            </section>

            {/* Main Experience Grid - More Whitespace */}
            <section className="px-6 py-12 pb-32 max-w-[1600px] mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ocean/30 block mb-2">Recomendações da Curadoria</span>
                        <h2 className="text-4xl md:text-6xl font-secondary italic text-ocean">
                            {selectedCategory === "Todos" ? "Experiências em Destaque" : selectedCategory}
                        </h2>
                    </div>
                    <p className="text-ocean/40 text-xs font-black uppercase tracking-widest hidden md:block">
                        {filteredExperiences.length} Destinos Encontrados
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredExperiences.map((exp) => (
                        <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
