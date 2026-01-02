import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
    return (
        <div className="glass-morphism rounded-3xl p-8 premium-card">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-black text-ocean/40 uppercase tracking-widest mb-2">{title}</p>
                    <p className="text-4xl font-black text-ocean">{value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${color}`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ experiences: 0, reviews: 0, users: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [expSnap, reviewSnap, userSnap] = await Promise.all([
                    getDocs(collection(db, "experiences")),
                    getDocs(collection(db, "reviews")),
                    getDocs(collection(db, "users")),
                ]);
                setStats({
                    experiences: expSnap.size, // Real count
                    reviews: reviewSnap.size,
                    users: userSnap.size,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-4xl font-secondary italic text-ocean mb-2">Dashboard</h1>
                <p className="text-ocean/50 font-primary">Bem-vindo, {user?.displayName}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="Experiências"
                    value={stats.experiences}
                    icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    color="bg-coral"
                />
                <StatCard
                    title="Avaliações"
                    value={stats.reviews}
                    icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    color="bg-ocean"
                />
                <StatCard
                    title="Usuários"
                    value={stats.users}
                    icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    color="bg-green-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="glass-morphism rounded-3xl p-8">
                <h3 className="text-xl font-secondary italic text-ocean mb-6">Ações Rápidas</h3>
                <div className="flex flex-wrap gap-4">
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
            </div>
        </div>
    );
}
