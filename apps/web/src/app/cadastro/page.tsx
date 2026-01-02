"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "@exploravibe/shared";
import { mapAuthError } from "@/lib/authErrors";
import FlashlightCursor from "@/components/FlashlightCursor";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });

            const role = email === "exemplo@email.com" ? "admin" : "customer";
            const profile: UserProfile = {
                uid: user.uid,
                email: user.email || "",
                displayName: name,
                photoURL: user.photoURL || null as any,
                role: role as any,
                consent: { personalization: false, marketing: false, sensitiveData: false, location: false },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await setDoc(doc(db, "users", user.uid), profile);

            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Register Error:", err.code);
            setError(mapAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden selection:bg-crystal selection:text-ocean text-ocean">
            <FlashlightCursor />

            <div className="w-full max-w-lg glass-morphism rounded-[3rem] shadow-2xl p-12 sm:p-20 space-y-12 animate-in fade-in zoom-in duration-700 border border-ocean/5 relative z-10 premium-card">
                <div className="text-center">
                    <h1 className="text-6xl font-secondary italic text-ocean tracking-tighter mb-6">Novo Passe</h1>
                    <p className="text-ocean/40 font-primary font-bold text-sm uppercase tracking-[0.3em]">O Futuro do Turismo 2026</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] ml-2">Nome de Explorador</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 focus:ring-4 focus:ring-ocean/5 outline-none transition font-primary font-bold text-sm text-ocean placeholder:text-ocean/20"
                            placeholder="Seu nome completo"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] ml-2">Identidade (E-mail)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 focus:ring-4 focus:ring-ocean/5 outline-none transition font-primary font-bold text-sm text-ocean placeholder:text-ocean/20"
                            placeholder="exemplo@vibe.com"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-ocean/30 uppercase tracking-[0.4em] ml-2">Código Secreto (Senha)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl border border-ocean/5 bg-crystal/10 focus:ring-4 focus:ring-ocean/5 outline-none transition font-primary font-bold text-sm text-ocean placeholder:text-ocean/20"
                            placeholder="Mínimo 6 dígitos"
                            minLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-coral text-white font-black py-6 rounded-2xl shadow-xl shadow-coral/10 transition transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.3em] mt-4"
                    >
                        {loading ? "Validando..." : "Confirmar Minha Vibe ⚡"}
                    </button>
                </form>

                <p className="text-center text-[10px] font-black text-ocean/40 uppercase tracking-widest">
                    Já possui cadastro?{" "}
                    <Link href="/login" className="text-ocean hover:underline ml-2">
                        Acessar
                    </Link>
                </p>

                <div className="text-center pt-8 border-t border-ocean/5">
                    <span className="text-[9px] font-black text-ocean/15 uppercase tracking-[0.4em]">ExploraVibe Platform 2026</span>
                </div>
            </div>
        </div>
    );
}
