"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_EMAIL = "cleber.ihs@gmail.com";
const CATEGORIES = ["Gastronomia", "Cultura", "Aventura", "Lazer"] as const;
const INTERESTS = ["Sertanejo", "Ecoturismo", "Família", "Religioso", "Gastronomia", "Aventura", "Cultura", "Lazer", "Vida Noturna"];
const TRAVEL_STYLES = ["aventureiro", "relaxado", "cultural", "festivo"] as const;
const CITIES = [
    { city: "João Pessoa", state: "PB" },
    { city: "Goiânia", state: "GO" },
];

export default function NovaExperiencia() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const isAdmin = user?.email === ADMIN_EMAIL;

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
                targetInterests,
                targetStyles,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            router.push("/admin/experiencias");
        } catch (error) {
            console.error("Error creating experience:", error);
            alert("Erro ao criar experiência. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setTargetInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const toggleStyle = (style: string) => {
        setTargetStyles(prev =>
            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
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
        <main className="min-h-screen bg-white pb-20">
            <Header />

            <div className="max-w-4xl mx-auto px-6 pt-32">
                <Link href="/admin/experiencias" className="text-ocean/40 hover:text-ocean text-sm font-bold mb-4 flex items-center gap-2">
                    ← Voltar às Experiências
                </Link>
                <h1 className="text-4xl font-secondary italic text-ocean mb-12">Nova Experiência</h1>

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
                        <h2 className="text-xl font-secondary italic text-ocean mb-4">Preço e Mídia</h2>
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
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">URL da Imagem</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                        </div>
                        {imageUrl && (
                            <img src={imageUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-xl mt-4" />
                        )}
                    </section>

                    {/* Targeting */}
                    <section className="glass-morphism rounded-3xl p-8 space-y-6">
                        <h2 className="text-xl font-secondary italic text-ocean mb-2">Segmentação de Público</h2>
                        <p className="text-ocean/40 text-sm mb-6">Selecione os interesses e estilos de viagem para recomendações automáticas.</p>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest">Interesses</label>
                            <div className="flex flex-wrap gap-3">
                                {INTERESTS.map(interest => (
                                    <button
                                        type="button"
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${targetInterests.includes(interest)
                                            ? "bg-ocean text-white shadow-lg"
                                            : "bg-crystal/30 text-ocean/60 hover:bg-crystal/50"}`}
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
                                            ? "bg-coral text-white shadow-lg"
                                            : "bg-crystal/30 text-ocean/60 hover:bg-crystal/50"}`}
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
                            href="/admin/experiencias"
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
        </main>
    );
}
