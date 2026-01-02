import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { VERSION } from "@exploravibe/shared";
import { mapAuthError } from "@/lib/authErrors";
import FlashlightCursor from "@/components/FlashlightCursor";

export default function Login() {
    const [email, setEmail] = useState("");

    useEffect(() => {
        const savedEmail = localStorage.getItem("lastEmail");
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Check for redirect param
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect") || "/";
            navigate(redirect);
        } catch (err: any) {
            console.error("Login Error:", err.code);
            setError(mapAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Check for redirect param
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect") || "/";
            navigate(redirect);
        } catch (err: any) {
            console.error("Google Login Error:", err.code);
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
                    <h1 className="text-6xl font-secondary italic text-ocean tracking-tighter mb-6">ExploraVibe</h1>
                    <p className="text-ocean/40 font-primary font-bold text-sm uppercase tracking-[0.3em]">Portal de Experiências</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="space-y-8">
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
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ocean text-white font-black py-6 rounded-2xl shadow-xl shadow-ocean/10 transition transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.3em] mt-4"
                    >
                        {loading ? "Sintonizando..." : "Iniciar Experiência ⚡"}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-ocean/5"></span>
                    </div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                        <span className="px-6 bg-white text-ocean/30">Vibe Social</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-4 bg-white border border-ocean/10 text-ocean font-black text-[10px] uppercase tracking-widest py-6 rounded-2xl hover:bg-crystal/30 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                            fill="#4285F4"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google Premium
                </button>

                <p className="text-center text-[10px] font-black text-ocean/40 uppercase tracking-widest">
                    Sem acesso?{" "}
                    <Link to="/cadastro" className="text-coral hover:underline ml-2">
                        Criar Passe
                    </Link>
                </p>

                <div className="text-center pt-8 border-t border-ocean/5 space-y-4">
                    <Link
                        to="/admin"
                        className="text-[9px] font-black text-ocean/10 uppercase tracking-[0.4em] hover:text-ocean/30 transition-colors"
                    >
                        🔐 Área Restrita
                    </Link>
                    <span className="block text-[9px] font-black text-ocean/15 uppercase tracking-[0.4em]">ExploraVibe Platform v{VERSION}</span>
                </div>
            </div>
        </div>
    );
}
