"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES = ["Gastronomia", "Cultura", "Aventura", "Lazer"] as const;
const INTERESTS = ["Sertanejo", "Ecoturismo", "Família", "Religioso", "Gastronomia", "Aventura", "Cultura", "Lazer", "Vida Noturna"];
const TRAVEL_STYLES = ["aventureiro", "relaxado", "cultural", "festivo"] as const;
const CITIES = [
    { city: "João Pessoa", state: "PB" },
    { city: "Goiânia", state: "GO" },
];

export default function NovaExperienciaPage() {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [category, setCategory] = useState<typeof CATEGORIES[number]>("Cultura");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [address, setAddress] = useState("");
    const [cityIndex, setCityIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [commissionRate, setCommissionRate] = useState("12");

    // AI Targeting (for automatic recommendations)
    const [targetInterests, setTargetInterests] = useState<string[]>([]);
    const [targetStyles, setTargetStyles] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;

        setSaving(true);
        try {
            const selectedCity = CITIES[cityIndex];
            await addDoc(collection(db, "experiences"), {
                title,
                description,
                longDescription,
                category,
                price: parseFloat(price),
                currency: "BRL",
                duration,
                images: [imageUrl],
                location: {
                    address,
                    city: selectedCity.city,
                    state: selectedCity.state,
                },
                rating: 0,
                reviewCount: 0,
                commissionRate: parseFloat(commissionRate) / 100,
                // AI targeting metadata
                targetInterests,
                targetStyles,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            router.push("/experiencias");
        } catch (error) {
            console.error("Error creating experience:", error);
            alert("Erro ao criar experiência. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setTargetInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const toggleStyle = (style: string) => {
        setTargetStyles(prev =>
            prev.includes(style)
                ? prev.filter(s => s !== style)
                : [...prev, style]
        );
    };

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/experiencias" className="text-ocean/40 hover:text-ocean text-sm font-bold mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar às Experiências
                    </Link>
                    <h1 className="text-4xl font-secondary italic text-ocean">Nova Experiência</h1>
                    <p className="text-ocean/50 mt-2">Preencha os detalhes da nova experiência turística</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info */}
                    <section className="glass-morphism rounded-3xl p-8 space-y-6">
                        <h2 className="text-xl font-secondary italic text-ocean mb-4">Informações Básicas</h2>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                placeholder="Ex: Passeio de Catamarã ao Pôr do Sol"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Descrição Curta</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5 resize-none"
                                placeholder="Breve descrição para listagens"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Descrição Completa</label>
                            <textarea
                                value={longDescription}
                                onChange={(e) => setLongDescription(e.target.value)}
                                rows={5}
                                className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5 resize-none"
                                placeholder="Descrição detalhada da experiência"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean outline-none focus:ring-4 focus:ring-ocean/5"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Duração</label>
                                <input
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                    placeholder="Ex: 2h, 4h, 1 dia"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Location */}
                    <section className="glass-morphism rounded-3xl p-8 space-y-6">
                        <h2 className="text-xl font-secondary italic text-ocean mb-4">Localização</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Cidade</label>
                                <select
                                    value={cityIndex}
                                    onChange={(e) => setCityIndex(parseInt(e.target.value))}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean outline-none focus:ring-4 focus:ring-ocean/5"
                                >
                                    {CITIES.map((c, i) => (
                                        <option key={i} value={i}>{c.city}, {c.state}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Endereço</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                    placeholder="Ex: Praia do Jacaré"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="glass-morphism rounded-3xl p-8 space-y-6">
                        <h2 className="text-xl font-secondary italic text-ocean mb-4">Preços e Comissão</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Preço (R$)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                    placeholder="120"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Comissão (%)</label>
                                <input
                                    type="number"
                                    value={commissionRate}
                                    onChange={(e) => setCommissionRate(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                    placeholder="12"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Media */}
                    <section className="glass-morphism rounded-3xl p-8 space-y-6">
                        <h2 className="text-xl font-secondary italic text-ocean mb-4">Mídia</h2>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">URL da Imagem Principal</label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                placeholder="https://..."
                                required
                            />
                        </div>
                        {imageUrl && (
                            <div className="mt-4">
                                <img src={imageUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                            </div>
                        )}
                    </section>

                    {/* AI Targeting */}
                    <section className="glass-morphism rounded-3xl p-8 space-y-6">
                        <h2 className="text-xl font-secondary italic text-ocean mb-2">Segmentação de Público</h2>
                        <p className="text-ocean/40 text-sm mb-6">Selecione os interesses e estilos de viagem que combinam com esta experiência. Isso ajuda o sistema a recomendar automaticamente aos usuários certos.</p>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Interesses Relacionados</label>
                            <div className="flex flex-wrap gap-3">
                                {INTERESTS.map(interest => (
                                    <button
                                        type="button"
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${targetInterests.includes(interest)
                                            ? "bg-ocean text-white shadow-lg shadow-ocean/20"
                                            : "bg-crystal/30 text-ocean/60 hover:bg-crystal/50"
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Estilos de Viagem</label>
                            <div className="flex flex-wrap gap-3">
                                {TRAVEL_STYLES.map(style => (
                                    <button
                                        type="button"
                                        key={style}
                                        onClick={() => toggleStyle(style)}
                                        className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${targetStyles.includes(style)
                                            ? "bg-coral text-white shadow-lg shadow-coral/20"
                                            : "bg-crystal/30 text-ocean/60 hover:bg-crystal/50"
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Link
                            href="/experiencias"
                            className="flex-1 py-5 text-center bg-white border border-ocean/10 text-ocean font-black text-sm uppercase tracking-widest rounded-xl hover:bg-crystal/20 transition-all"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-5 bg-coral text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-coral/20 hover:shadow-coral/40 transition-all disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Criar Experiência"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
