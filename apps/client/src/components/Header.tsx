"use client";

import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Link } from "react-router-dom";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function Header() {
    const { user } = useAuth();
    const { itemCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <header className="fixed top-0 w-full glass-morphism z-50 border-b border-ocean/10 shadow-sm backdrop-blur-2xl">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-3xl font-secondary italic text-ocean tracking-tighter">
                        ExploraVibe
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-3 bg-crystal/50 rounded-2xl hover:bg-ocean hover:text-white transition-all group"
                        >
                            <svg className="w-6 h-6 text-ocean group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-black text-white ring-2 ring-white shadow-lg">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <>
                                <div className="h-8 w-px bg-ocean/10 mx-1 hidden sm:block"></div>

                                <div className="flex items-center gap-6">
                                    <Link to="/viagens" className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-ocean/60 hover:text-coral transition">
                                        Roteiros
                                    </Link>
                                    <Link to="/perfil" className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-ocean/60 hover:text-coral transition">
                                        Vibe Profile
                                    </Link>
                                </div>

                                <button
                                    onClick={() => signOut(auth)}
                                    className="p-3 text-ocean hover:text-coral transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-ocean text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-ocean/20 hover:bg-coral transition-all active:scale-95"
                            >
                                Iniciar Vibe
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
