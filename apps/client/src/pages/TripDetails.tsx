import { useParams, useNavigate } from "react-router-dom";
import { useTrips } from "@/lib/TripContext";
import { useAuth } from "@/lib/AuthContext";
import { useExperiences } from "@/lib/useExperiences";
import Header from "@/components/Header";
import { BentoGrid, BentoCard } from "@/components/BentoLayout";
import FlashlightCursor from "@/components/FlashlightCursor";
import { useEffect, useState } from "react";
import type { Trip } from "@exploravibe/shared";

export default function TripDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { trips } = useTrips();
    const { experiences } = useExperiences();
    const { user } = useAuth();

    // Find the trip from context
    const trip = trips.find(t => t.id === id);
    const [loading, setLoading] = useState(true);

    // If trips context is loading, we might not find it immediately
    useEffect(() => {
        if (trips.length > 0 || !loading) {
            setLoading(false);
        }
    }, [trips]);

    if (!trip) {
        return (
            <main className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center">
                    <h1 className="text-2xl font-bold text-ocean">Roteiro não encontrado ou carregando...</h1>
                    <button onClick={() => navigate("/viagens")} className="mt-4 text-coral underline">Voltar</button>
                </div>
            </main>
        );
    }

    // Resolve experiences
    const tripExperiences = trip.experienceIds.map(expId =>
        experiences.find(e => e.id === expId)
    ).filter(Boolean);

    return (
        <main className="min-h-screen bg-white pb-24 selection:bg-crystal selection:text-ocean overflow-x-hidden">
            <FlashlightCursor />
            <Header />

            <div className="max-w-[1600px] mx-auto px-6 pt-32">
                <div className="mb-12">
                    <button onClick={() => navigate("/viagens")} className="text-[10px] font-black uppercase tracking-[0.2em] text-ocean/40 hover:text-ocean mb-4 flex items-center gap-2 transition-colors">
                        ← Voltar aos Roteiros
                    </button>
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-coral mb-2 block">
                                Duração Total: {tripExperiences.length * 3}h (Estimado)
                            </span>
                            <h1 className="text-5xl md:text-7xl font-secondary italic text-ocean tracking-tighter">
                                {trip.name}
                            </h1>
                        </div>
                        <div className="flex -space-x-4">
                            {trip.members.map((member, i) => (
                                <div key={i} className="w-16 h-16 rounded-full bg-ocean text-white border-4 border-white flex items-center justify-center text-sm font-black shadow-lg uppercase relative group cursor-help">
                                    {member.userId === user?.uid ? "VC" : "M" + (i + 1)}
                                    <span className="absolute -bottom-8 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                        {member.role === "owner" ? "Dono" : "Membro"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {tripExperiences.length === 0 ? (
                    <div className="bg-crystal/10 rounded-[3rem] p-20 text-center border border-ocean/5">
                        <span className="text-6xl mb-6 block opacity-30">🗺️</span>
                        <h3 className="text-2xl font-bold text-ocean mb-4">Seu roteiro está vazio</h3>
                        <p className="text-ocean/50 mb-8"> Navegue pelas experiências e adicione para começar sua jornada.</p>
                        <button onClick={() => navigate("/")} className="px-8 py-4 bg-ocean text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-coral transition">
                            Explorar Experiências
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {tripExperiences.map((exp, index) => (
                            <div key={exp!.id} className="group flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-[2.5rem] border border-ocean/5 hover:border-ocean/20 transition-all shadow-sm">
                                <div className="w-full md:w-1/3 aspect-video rounded-[2rem] overflow-hidden relative">
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-sm">
                                        #{index + 1}
                                    </span>
                                    <img src={exp!.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={exp!.title} />
                                </div>
                                <div className="w-full md:w-2/3 pr-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-3xl font-secondary italic text-ocean">{exp!.title}</h3>
                                        <span className="text-xl font-black text-ocean">R$ {exp!.price}</span>
                                    </div>
                                    <p className="text-ocean/60 font-primary mb-6 line-clamp-2">{exp!.description}</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => navigate(`/experiencia/${exp!.id}`)} className="px-6 py-3 bg-crystal text-ocean rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-ocean hover:text-white transition">
                                            Ver Detalhes
                                        </button>
                                        <button className="px-6 py-3 border border-red-100 text-red-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition">
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
