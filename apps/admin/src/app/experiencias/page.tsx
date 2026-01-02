"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Experience } from "@exploravibe/shared";

export default function ExperienciasPage() {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/login");
        }
    }, [user, loading, isAdmin, router]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const snapshot = await getDocs(collection(db, "experiences"));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
                setExperiences(data);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoadingData(false);
            }
        };
        if (isAdmin) fetchExperiences();
    }, [isAdmin]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta experiência?")) return;
        try {
            await deleteDoc(doc(db, "experiences", id));
            setExperiences(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            alert("Erro ao excluir experiência.");
        }
    };

    const filteredExperiences = experiences.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || exp.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href="/" className="text-ocean/40 hover:text-ocean text-sm font-bold mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-4xl font-secondary italic text-ocean">Experiências</h1>
                        <p className="text-ocean/50 mt-2">Gerencie todas as experiências turísticas</p>
                    </div>
                    <Link
                        href="/experiencias/nova"
                        className="flex items-center gap-3 px-8 py-4 bg-coral text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-coral/20 hover:shadow-coral/40 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nova Experiência
                    </Link>
                </div>

                {/* Filters */}
                <div className="glass-morphism rounded-3xl p-6 mb-8 flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Buscar experiências..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow px-6 py-3 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-sm text-ocean placeholder:text-ocean/30 outline-none focus:ring-4 focus:ring-ocean/5"
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-6 py-3 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-sm text-ocean outline-none focus:ring-4 focus:ring-ocean/5"
                    >
                        <option value="all">Todas categorias</option>
                        <option value="Gastronomia">Gastronomia</option>
                        <option value="Cultura">Cultura</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Lazer">Lazer</option>
                    </select>
                </div>

                {/* Table */}
                {loadingData ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean mx-auto"></div>
                    </div>
                ) : experiences.length === 0 ? (
                    <div className="glass-morphism rounded-3xl p-20 text-center">
                        <span className="text-6xl mb-6 block">🎯</span>
                        <h3 className="text-2xl font-secondary italic text-ocean mb-2">Nenhuma experiência cadastrada</h3>
                        <p className="text-ocean/50 mb-8">Comece adicionando sua primeira experiência turística.</p>
                        <Link
                            href="/experiencias/nova"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-coral text-white font-black text-xs uppercase tracking-widest rounded-xl"
                        >
                            Criar Primeira Experiência
                        </Link>
                    </div>
                ) : (
                    <div className="glass-morphism rounded-3xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-ocean text-white">
                                <tr>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Experiência</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Categoria</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Cidade</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Preço</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Rating</th>
                                    <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ocean/5">
                                {filteredExperiences.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-crystal/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={exp.images[0]}
                                                    alt={exp.title}
                                                    className="w-16 h-12 object-cover rounded-xl"
                                                />
                                                <div>
                                                    <p className="font-bold text-ocean">{exp.title}</p>
                                                    <p className="text-ocean/40 text-xs">{exp.duration}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-4 py-1 bg-crystal rounded-full text-[10px] font-black text-ocean uppercase tracking-widest">
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-ocean/70 text-sm">{exp.location.city}</td>
                                        <td className="px-6 py-4 font-bold text-ocean">R$ {exp.price}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1 text-coral font-bold">
                                                ★ {exp.rating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/experiencias/${exp.id}`}
                                                    className="p-2 rounded-lg hover:bg-ocean/10 text-ocean transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(exp.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
