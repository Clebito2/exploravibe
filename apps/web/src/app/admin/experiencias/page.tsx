"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Experience } from "@exploravibe/shared";
import { MOCK_EXPERIENCES } from "@/lib/mockData";

const ADMIN_EMAIL = "cleber.ihs@gmail.com";

export default function AdminExperiencias() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [experiences, setExperiences] = useState<Experience[]>(MOCK_EXPERIENCES);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    const isAdmin = user?.email === ADMIN_EMAIL;

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/login");
        }
    }, [user, loading, isAdmin, router]);

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
        <main className="min-h-screen bg-white">
            <Header />

            <div className="flex pt-20">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-ocean text-white p-6 fixed left-0 top-20">
                    <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Painel Admin</p>
                    </div>
                    <nav className="space-y-2">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link href="/admin/experiencias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-white/10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Experiências
                        </Link>
                    </nav>
                    <div className="absolute bottom-6 left-6 right-6">
                        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold">
                            ← Voltar ao Site
                        </Link>
                    </div>
                </aside>

                <div className="flex-grow ml-64 p-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-secondary italic text-ocean">Experiências</h1>
                            <p className="text-ocean/50 mt-2">Gerencie todas as experiências turísticas</p>
                        </div>
                        <Link
                            href="/admin/experiencias/nova"
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
                    <div className="glass-morphism rounded-3xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-ocean text-white">
                                <tr>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Experiência</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Categoria</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Cidade</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest">Preço</th>
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
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
