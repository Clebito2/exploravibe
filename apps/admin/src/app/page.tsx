"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Experiências", href: "/experiencias", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { name: "Destinos", href: "/destinos", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  { name: "Avaliações", href: "/avaliacoes", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { name: "Usuários", href: "/usuarios", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
];

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

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ experiences: 0, reviews: 0, users: 0, bookings: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && !isAdmin) {
      router.push("/login");
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    // Fetch basic stats
    const fetchStats = async () => {
      try {
        const [expSnap, reviewSnap, userSnap] = await Promise.all([
          getDocs(collection(db, "experiences")),
          getDocs(collection(db, "reviews")),
          getDocs(collection(db, "users")),
        ]);
        setStats({
          experiences: expSnap.size,
          reviews: reviewSnap.size,
          users: userSnap.size,
          bookings: 0, // TODO: Add bookings count
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-ocean text-white p-8 flex flex-col">
        <div className="mb-12">
          <h1 className="text-2xl font-secondary italic">ExploraVibe</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-grow space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-bold text-sm">{user?.displayName}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12">
        <div className="mb-12">
          <h2 className="text-4xl font-secondary italic text-ocean mb-2">Dashboard</h2>
          <p className="text-ocean/50 font-primary">Visão geral do sistema ExploraVibe</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
          <StatCard
            title="Reservas"
            value={stats.bookings}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="glass-morphism rounded-3xl p-8">
          <h3 className="text-xl font-secondary italic text-ocean mb-6">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/experiencias/nova"
              className="flex items-center gap-3 px-8 py-4 bg-coral text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-coral/20 hover:shadow-coral/40 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nova Experiência
            </Link>
            <Link
              href="/destinos/novo"
              className="flex items-center gap-3 px-8 py-4 bg-ocean text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-ocean/20 hover:shadow-ocean/40 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Novo Destino
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
