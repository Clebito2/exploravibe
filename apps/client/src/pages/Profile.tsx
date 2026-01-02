import { useAuth } from "@/lib/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import type { UserPreferences, UserConsent } from "@exploravibe/shared";
import FlashlightCursor from "@/components/FlashlightCursor";
import Skeleton from "@/components/Skeleton";
import { uploadProfilePhoto } from "@/lib/uploadImage";

const INTERESTS = ["Sertanejo", "Ecoturismo", "Família", "Religioso", "Gastronomia", "Aventura", "Cultura", "Lazer", "Vida Noturna"];
const BUDGETS = ["baixo", "medio", "alto"];
const TRAVEL_STYLES = ["aventureiro", "relaxado", "cultural", "festivo"];

export default function Profile() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState<UserPreferences>({
        interests: [],
        budget: "medio",
        accessibilityRequired: false,
        travelStyle: "cultural",
    });
    const [consent, setConsent] = useState<UserConsent>({
        personalization: false,
        marketing: false,
        sensitiveData: false,
        location: false,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login?redirect=/perfil");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user?.preferences) setPreferences(user.preferences);
        if (user?.consent) setConsent(user.consent);
    }, [user]);

    const toggleInterest = (interest: string) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL || null,
                role: user.role || "customer",
                preferences,
                consent,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            alert("Preferências salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar preferências. Verifique o console.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white overflow-hidden">
                <Header />
                <div className="max-w-5xl mx-auto px-6 pt-32">
                    <div className="glass-morphism rounded-[3rem] p-12 sm:p-20 border border-ocean/5 shadow-2xl space-y-12">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-32" variant="text" />
                            <Skeleton className="h-24 w-3/4" />
                        </div>
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <Skeleton className="h-4 w-40" variant="text" />
                                <div className="flex flex-wrap gap-4">
                                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-32" />)}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden">
            <FlashlightCursor />
            <Header />

            <div className="max-w-5xl mx-auto px-6 pt-32">
                <div className="glass-morphism rounded-[3rem] shadow-2xl p-12 sm:p-20 border border-ocean/5 premium-card relative overflow-hidden bg-white">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-16">
                        <div className="relative group">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-[2rem] bg-ocean flex items-center justify-center text-white text-4xl font-black shadow-xl">
                                    {user.displayName?.charAt(0) || "?"}
                                </div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] cursor-pointer">
                                <div className="text-center">
                                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase">Alterar</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file || !user) return;

                                        try {
                                            setSaving(true);
                                            const photoURL = await uploadProfilePhoto(user.uid, file);

                                            if (auth.currentUser) {
                                                await updateProfile(auth.currentUser, { photoURL });
                                            }

                                            await setDoc(doc(db, "users", user.uid),
                                                { photoURL },
                                                { merge: true }
                                            );

                                            alert("✅ Foto atualizada com sucesso!");
                                        } catch (error: any) {
                                            console.error("Error:", error);
                                            alert(`❌ ${error.message || "Erro ao fazer upload da foto"}`);
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-black text-ocean/40 uppercase tracking-[0.4em] mb-2">Olá, viajante</p>
                            <h2 className="text-3xl font-secondary italic text-ocean">{user.displayName}</h2>
                            <p className="text-ocean/50 text-sm font-primary mt-1">{user.email}</p>
                            {user.photoURL && (
                                <p className="text-[10px] text-ocean/30 mt-2">📷 Foto sincronizada do Google</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 mb-16">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-coral rounded-full"></span>
                            <span className="text-[10px] font-black text-ocean/40 uppercase tracking-[0.4em]">Confidencial & Pessoal</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-secondary italic text-ocean tracking-tighter leading-none">
                            Perfil <br />Vibe Profile.
                        </h1>
                    </div>

                    <section className="space-y-20">
                        {/* Interests */}
                        <div>
                            <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] mb-8 ml-1">
                                Sintonias Preferenciais
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {INTERESTS.map(interest => (
                                    <button
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-400 border ${preferences.interests.includes(interest)
                                            ? "bg-ocean text-white border-ocean shadow-xl shadow-ocean/10 scale-[1.05]"
                                            : "bg-crystal/20 text-ocean/50 border-ocean/5 hover:border-ocean/20"
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget & Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] mb-8 ml-1">
                                    Perfil de Gasto
                                </label>
                                <div className="flex bg-crystal/10 p-2 rounded-2xl border border-ocean/5">
                                    {BUDGETS.map(b => (
                                        <button
                                            key={b}
                                            onClick={() => setPreferences({ ...preferences, budget: b as any })}
                                            className={`flex-1 py-5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all ${preferences.budget === b
                                                ? "bg-white text-ocean shadow-lg"
                                                : "text-ocean/30 hover:text-ocean/60"
                                                }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] mb-8 ml-1">
                                    Identidade de Viagem
                                </label>
                                <select
                                    value={preferences.travelStyle}
                                    onChange={(e) => setPreferences({ ...preferences, travelStyle: e.target.value as any })}
                                    className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 outline-none focus:ring-4 focus:ring-ocean/5 font-primary font-bold text-sm text-ocean appearance-none shadow-sm cursor-pointer"
                                >
                                    {TRAVEL_STYLES.map(s => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* LGPD Consent */}
                        <div className="pt-16 border-t border-ocean/5 space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">🛡️</span>
                                <h3 className="text-2xl font-secondary italic text-ocean underline decoration-coral decoration-4 underline-offset-8">Dados & Privacidade</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {[
                                    { id: "personalization", label: "Algoritmo Preditivo", icon: "✨", desc: "IA Vibe para roteiros únicos" },
                                    { id: "location", label: "Geo-Sinalização", icon: "📍", desc: "Experiências próximas em tempo real" },
                                ].map(item => (
                                    <label key={item.id} className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-crystal/5 border border-ocean/5 cursor-pointer group hover:bg-crystal/10 transition-all shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl">{item.icon}</span>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={consent[item.id as keyof UserConsent]}
                                                    onChange={(e) => setConsent({ ...consent, [item.id]: e.target.checked })}
                                                />
                                                <div className={`w-14 h-7 rounded-full transition-colors duration-500 ${consent[item.id as keyof UserConsent] ? "bg-ocean" : "bg-ocean/10"}`}></div>
                                                <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-500 transform ${consent[item.id as keyof UserConsent] ? "translate-x-7" : ""}`}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-black text-ocean uppercase tracking-widest mb-1 group-hover:text-coral transition-colors">
                                                {item.label}
                                            </span>
                                            <span className="block text-[10px] font-medium text-ocean/30 uppercase tracking-tight">
                                                {item.desc}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-8 bg-coral text-white font-black rounded-2xl shadow-2xl shadow-coral/20 hover:shadow-coral/40 transition transform active:scale-98 disabled:opacity-50 text-[10px] uppercase tracking-[0.4em]"
                        >
                            {saving ? "Salvando Identidade..." : "Selar Vibe Profile ⚡"}
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}
