"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Admin Login Error:", err.code);
            setError("Credenciais inválidas ou sem permissão de admin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-ocean">
            <div className="w-full max-w-lg glass-morphism rounded-[3rem] shadow-2xl p-12 sm:p-20 space-y-12 border border-ocean/5 premium-card">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-ocean flex items-center justify-center text-white">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-secondary italic text-ocean tracking-tighter mb-4">Admin</h1>
                    <p className="text-ocean/40 font-primary font-bold text-sm uppercase tracking-[0.3em]">Painel de Gestão</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] ml-2">E-mail Administrativo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 focus:ring-4 focus:ring-ocean/5 outline-none transition font-primary font-bold text-sm text-ocean placeholder:text-ocean/20"
                            placeholder="admin@exploravibe.com"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] ml-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 focus:ring-4 focus:ring-ocean/5 outline-none transition font-primary font-bold text-sm text-ocean placeholder:text-ocean/20"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ocean text-white font-black py-6 rounded-2xl shadow-xl shadow-ocean/10 transition transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.3em]"
                    >
                        {loading ? "Autenticando..." : "Acessar Painel"}
                    </button>
                </form>

                <div className="text-center pt-8 border-t border-ocean/5">
                    <span className="text-[9px] font-black text-ocean/15 uppercase tracking-[0.4em]">ExploraVibe Admin Panel</span>
                </div>
            </div>
        </div>
    );
}
