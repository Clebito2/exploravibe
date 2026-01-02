import { useAuth } from "@/lib/AuthContext";
import { useTrips } from "@/lib/TripContext";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExperiences } from "@/lib/useExperiences";
import { BentoGrid, BentoCard } from "@/components/BentoLayout";
import FlashlightCursor from "@/components/FlashlightCursor";
import Skeleton from "@/components/Skeleton";

export default function TripList() {
    const { user, loading: authLoading } = useAuth();
    const { trips, createTrip, addMember, loading: tripsLoading } = useTrips();
    const { experiences } = useExperiences(); // Use live experiences
    const [newTripName, setNewTripName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login?redirect=/viagens");
        }
    }, [user, authLoading, navigate]);

    // ... (keep handleCreate same)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTripName) return;
        setIsCreating(true);
        try {
            const tripId = await createTrip(newTripName);
            alert(`✅ Roteiro "${newTripName}" criado com sucesso! ID: ${tripId}`);
            setNewTripName("");
            // Force reload to show new trip
            window.location.reload();
        } catch (e: any) {
            console.error("Create trip error:", e);
            alert(`❌ Erro ao criar roteiro: ${e.message || e.code || "Erro desconhecido"}`);
        } finally {
            setIsCreating(false);
        }
    };

    if (authLoading || (!user && !authLoading)) {
        // ... (keep skeleton same)
        return (
            <main className="min-h-screen bg-white overflow-hidden">
                <Header />
                <div className="max-w-[1600px] mx-auto px-6 pt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                        <div className="lg:col-span-7 space-y-6">
                            <Skeleton className="h-4 w-32" variant="text" />
                            <Skeleton className="h-24 w-3/4" />
                            <Skeleton className="h-12 w-1/2" />
                        </div>
                        <div className="lg:col-span-5">
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-96 w-full" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white pb-24 selection:bg-crystal selection:text-ocean overflow-x-hidden">
            <FlashlightCursor />
            <Header />

            <div className="max-w-[1600px] mx-auto px-6 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-1 bg-coral rounded-full"></span>
                            <span className="text-[10px] font-black text-ocean/40 uppercase tracking-[0.4em]">Arquitetura de Jornada</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-secondary italic text-ocean tracking-tighter leading-[0.85] mb-8">
                            Meus <br />Roteiros.
                        </h1>
                        <p className="text-ocean/60 font-primary font-medium text-lg max-w-lg leading-relaxed">
                            Sua curadoria tecnológica para vivências extraordinárias em João Pessoa e Goiânia.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <form onSubmit={handleCreate} className="glass-morphism p-8 rounded-[2.5rem] border border-ocean/10 shadow-xl flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Nome do seu roteiro Elite"
                                value={newTripName}
                                onChange={(e) => setNewTripName(e.target.value)}
                                className="flex-grow px-8 py-5 rounded-2xl bg-white/50 border border-ocean/5 outline-none focus:ring-4 focus:ring-ocean/5 font-primary font-bold text-sm text-ocean placeholder:text-ocean/20 transition-all"
                            />
                            <button
                                disabled={isCreating}
                                className="px-10 py-5 bg-coral text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-coral/20 hover:shadow-coral/40 transition active:scale-95 whitespace-nowrap disabled:opacity-50"
                            >
                                {isCreating ? "Criando..." : "Nova Vibe"}
                            </button>
                        </form>
                    </div>
                </div>

                {tripsLoading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-ocean"></div>
                    </div>
                ) : trips.length === 0 ? (
                    <BentoGrid>
                        <BentoCard span="full" className="bg-crystal/30 border-2 border-dashed border-ocean/10 flex flex-col items-center justify-center text-center py-32">
                            <span className="text-7xl mb-10 opacity-40">🗺️</span>
                            <h3 className="text-4xl font-secondary italic text-ocean mb-6">Nenhum roteiro ativo</h3>
                            <p className="text-ocean/50 max-w-sm mx-auto font-primary font-medium leading-relaxed">
                                Crie sua primeira jornada personalizada e comece a colecionar momentos VIP.
                            </p>
                        </BentoCard>
                    </BentoGrid>
                ) : (
                    <BentoGrid>
                        {trips.map((trip) => (
                            <BentoCard key={trip.id} span={trip.experienceIds.length > 2 ? "medium" : "small"} className="bg-white hover:bg-crystal/10 transition-colors border border-ocean/5">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex -space-x-4">
                                        {trip.members.map((member, i) => {
                                            const isMe = member.userId === user?.uid;
                                            const initial = isMe ? (user?.email?.charAt(0).toUpperCase() || "U") : "M" + (i + 1);
                                            return (
                                                <div key={i} className="w-14 h-14 rounded-2xl bg-ocean text-white border-4 border-white flex items-center justify-center text-xs font-black shadow-lg uppercase overflow-hidden">
                                                    {isMe && user?.photoURL ? (
                                                        <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                                                    ) : (
                                                        initial
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <button
                                            onClick={() => {
                                                const email = prompt("Digite o email do amigo para convidar:");
                                                if (email) addMember(trip.id, email);
                                            }}
                                            className="w-14 h-14 rounded-2xl bg-crystal border-4 border-white flex items-center justify-center text-2xl text-ocean font-bold shadow-sm cursor-pointer hover:bg-ocean hover:text-white transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${trip.status === "planning" ? "bg-coral text-white" : "bg-ocean text-white"
                                        }`}>
                                        {trip.status === "planning" ? "Planejando" : "Confirmado"}
                                    </span>
                                </div>

                                <h3 className="text-4xl font-secondary italic text-ocean mb-8 group-hover:text-coral transition-colors tracking-tighter">
                                    {trip.name}
                                </h3>

                                <div className="space-y-4 mb-12 min-h-[140px]">
                                    {trip.experienceIds.length > 0 ? (
                                        trip.experienceIds.slice(0, 3).map(expId => {
                                            const exp = experiences.find(e => e.id === expId);
                                            return (
                                                <div key={expId} className="flex items-center gap-4 bg-crystal/20 p-4 rounded-2xl border border-ocean/5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-coral"></div>
                                                    <span className="text-xs font-bold text-ocean/80 truncate font-primary">
                                                        {exp?.title || "Carregando..."}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-ocean/30 text-sm font-medium italic font-primary">Sua jornada começa aqui...</p>
                                    )}
                                    {trip.experienceIds.length > 3 && (
                                        <p className="text-[10px] font-black text-coral uppercase tracking-widest pl-6">
                                            + {trip.experienceIds.length - 3} Vivências
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-ocean/10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-ocean/20 uppercase tracking-widest mb-1">Iniciado em</span>
                                        <span className="text-xs font-black text-ocean/60">
                                            {new Date(trip.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="flex items-center gap-4 bg-ocean text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-ocean/10 hover:bg-coral transition-all active:scale-95 group/btn"
                                        onClick={() => navigate(`/viagens/${trip.id}`)}
                                    >
                                        Explorar
                                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </BentoCard>
                        ))}
                    </BentoGrid>
                )}
            </div>
        </main>
    );
}
