"use client";

import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useTrips } from "@/lib/TripContext";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import Header from "@/components/Header";
import { Experience } from "@exploravibe/shared";
import { MOCK_EXPERIENCES } from "@/lib/mockData";
import FlashlightCursor from "@/components/FlashlightCursor";
import Skeleton from "@/components/Skeleton";

export default function ExperienceDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    const { addToCart } = useCart();
    const { trips, addToTrip } = useTrips();
    const [date, setDate] = useState("");
    const [travelers, setTravelers] = useState(1);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [addingToTrip, setAddingToTrip] = useState(false);

    const experience = MOCK_EXPERIENCES.find((e: Experience) => e.id === id);

    if (loading) {
        return (
            <main className="min-h-screen bg-white overflow-hidden">
                <Header />
                <div className="relative h-96 sm:h-[600px]">
                    <Skeleton className="w-full h-full rounded-none border-none" />
                </div>
                <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
                    <div className="bg-white/90 backdrop-blur-xl rounded-[4rem] p-10 sm:p-20 border border-ocean/5 shadow-2xl space-y-12">
                        <Skeleton className="h-6 w-32" variant="text" />
                        <Skeleton className="h-20 w-3/4" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            <div className="lg:col-span-2 space-y-8">
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                            <Skeleton className="h-96 w-full" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!experience) {
        return <div className="p-10 text-center font-primary text-ocean">Experiência não encontrada.</div>;
    }


    const handleAddToCart = () => {
        if (!user) {
            router.push(`/login?redirect=/experiencia/${id}`);
            return;
        }
        if (!date) {
            alert("Por favor, selecione uma data.");
            return;
        }
        addToCart(experience as any, date, travelers);
    };

    const handleAddToTrip = async () => {
        if (!user) {
            router.push(`/login?redirect=/experiencia/${id}`);
            return;
        }
        if (!selectedTripId) {
            alert("Selecione um roteiro ou crie um novo.");
            return;
        }
        setAddingToTrip(true);
        try {
            await addToTrip(selectedTripId, experience.id);
            alert("Adicionado ao seu roteiro!");
        } catch (e) {
            alert("Erro ao adicionar ao roteiro.");
        } finally {
            setAddingToTrip(false);
        }
    };

    return (
        <main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden">
            <FlashlightCursor />
            <Header />

            <div className="relative h-96 sm:h-[600px] overflow-hidden">
                <img
                    src={experience.images[0]}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
                <div className="bg-white/90 backdrop-blur-xl rounded-[4rem] shadow-2xl p-10 sm:p-20 border border-ocean/5 premium-card">
                    <div className="flex flex-wrap items-center gap-6 mb-10">
                        <span className="px-6 py-2 bg-ocean text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-ocean/10">
                            {experience.category}
                        </span>
                        <button
                            onClick={() => router.push(`/experiencia/${id}/avaliacoes`)}
                            className="flex items-center text-coral font-black text-sm tracking-widest gap-2 hover:text-ocean transition-colors group"
                        >
                            ★ <span className="text-ocean">{experience.rating}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-ocean/10"></span>
                            <span className="text-ocean/40 lowercase group-hover:text-ocean group-hover:underline">{experience.reviewCount} avaliações</span>
                        </button>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-secondary italic text-ocean mb-12 leading-[1.1] tracking-tighter">
                        {experience.title}
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="flex flex-wrap gap-10 text-ocean">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-crystal/30 flex items-center justify-center border border-ocean/5 shadow-sm">
                                        <svg className="w-6 h-6 text-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-ocean/20 mb-1">Localização</span>
                                        <span className="font-primary font-bold text-sm tracking-tight">{experience.location.city}, {experience.location.state}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-crystal/30 flex items-center justify-center border border-ocean/5 shadow-sm">
                                        <svg className="w-6 h-6 text-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-ocean/20 mb-1">Duração</span>
                                        <span className="font-primary font-bold text-sm tracking-tight">{experience.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-ocean max-w-none">
                                <p className="text-xl text-ocean/60 leading-relaxed font-primary font-medium">
                                    {experience.longDescription}
                                </p>
                            </div>

                            <div className="pt-12 border-t border-ocean/5">
                                <span className="block text-[10px] font-black text-ocean/20 uppercase tracking-[0.4em] mb-10">Agenda & Reserva</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest ml-2">Data Disponível</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 outline-none focus:ring-4 focus:ring-ocean/5 transition font-primary font-bold text-sm text-ocean shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest ml-2">Vagas (Travelers)</label>
                                        <div className="flex items-center justify-between bg-crystal/10 p-2 rounded-2xl border border-ocean/5 shadow-sm">
                                            <button
                                                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                                className="w-14 h-14 flex items-center justify-center rounded-xl bg-white hover:bg-crystal transition font-black text-2xl text-ocean shadow-sm active:scale-90"
                                            >
                                                -
                                            </button>
                                            <span className="text-2xl font-secondary italic text-ocean mx-4">{travelers}</span>
                                            <button
                                                onClick={() => setTravelers(travelers + 1)}
                                                className="w-14 h-14 flex items-center justify-center rounded-xl bg-ocean text-white hover:opacity-90 transition font-black text-2xl shadow-lg shadow-ocean/20 active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-crystal/5 rounded-[3rem] p-10 border border-ocean/5 shadow-sm">
                                <span className="block text-[10px] font-black text-ocean/20 uppercase tracking-[0.4em] mb-8">Arquitetura de Viagem</span>
                                <select
                                    value={selectedTripId}
                                    onChange={(e) => setSelectedTripId(e.target.value)}
                                    className="w-full mb-6 px-8 py-5 rounded-2xl border border-ocean/5 bg-white outline-none focus:ring-4 focus:ring-ocean/5 font-primary font-bold text-sm text-ocean appearance-none shadow-sm cursor-pointer"
                                >
                                    <option value="">Escolher Roteiro...</option>
                                    {trips.map(trip => (
                                        <option key={trip.id} value={trip.id}>{trip.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddToTrip}
                                    disabled={addingToTrip || !selectedTripId}
                                    className="w-full py-6 bg-white text-ocean border-2 border-ocean/10 hover:border-ocean hover:text-ocean transition-all font-black rounded-2xl text-[10px] uppercase tracking-widest disabled:opacity-30 active:scale-95 shadow-sm"
                                >
                                    {addingToTrip ? "Sincronizando..." : "Adicionar ao Meu Roteiro"}
                                </button>
                            </div>

                            <div className="bg-ocean rounded-[3rem] p-12 text-white shadow-2xl shadow-ocean/20">
                                <span className="block text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-4">Investimento Elite</span>
                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">R$</span>
                                    <span className="text-6xl font-secondary italic tracking-tighter">
                                        {experience.price * travelers}
                                    </span>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-6 bg-coral text-white font-black rounded-2xl shadow-xl shadow-coral/20 hover:shadow-coral/40 transition transform active:scale-95 text-[10px] uppercase tracking-[0.3em]"
                                >
                                    Confirmar Vibe ⚡
                                </button>
                                <p className="text-[9px] text-center font-black uppercase tracking-widest mt-6 opacity-30">Checkout Seguro SSL 256-bit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
