import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Experience } from "@exploravibe/shared";
import { MOCK_EXPERIENCES } from "@/lib/mockData";

export default function Experiences() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    useEffect(() => {
        // Load from Firestore
        const unsubscribe = onSnapshot(collection(db, "experiences"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
            // Merge with mocks if empty for demo or specific logic needed
            if (data.length === 0) {
                setExperiences(MOCK_EXPERIENCES);
            } else {
                setExperiences(data);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta experiência?")) return;
        try {
            await deleteDoc(doc(db, "experiences", id));
            // Snapshot listener will update state
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

    if (loading) return <div>Carregando...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-secondary italic text-ocean">Experiências</h1>
                    <p className="text-ocean/50 mt-2">Gerencie todas as experiências turísticas</p>
                </div>
                <Link
                    to="/admin/experiencias/nova"
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
    );
}
