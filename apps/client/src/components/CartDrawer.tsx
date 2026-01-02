"use client";

import { useCart } from "@/lib/CartContext";
import { VERSION } from "@exploravibe/shared";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeFromCart, total } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md glass-morphism shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/20">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tighter mt-4">Vibe Bag 🛍️</h2>
                        <button onClick={onClose} className="p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-slate-500 font-medium">Seu carrinho está vazio.</p>
                                <button onClick={onClose} className="text-[var(--ocean-start)] font-extrabold hover:underline uppercase tracking-widest text-xs">Começar a explorar</button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-5 p-5 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-white/20 dark:border-white/5 relative group premium-card">
                                    <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                                        <img src={item.experience.images[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight truncate">{item.experience.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{item.date} • {item.travelers} pessoas</p>
                                        <span className="text-xl font-[900] text-[var(--ocean-start)] dark:text-emerald-400">R$ {item.experience.price * item.travelers}</span>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg scale-75 group-hover:scale-100"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-10 border-t border-white/10 space-y-8 glass-morphism">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Premium</span>
                            <span className="text-4xl font-[900] text-slate-900 dark:text-white tracking-tighter">R$ {total}</span>
                        </div>
                        <button
                            disabled={items.length === 0}
                            className="w-full py-6 bg-ocean-gradient disabled:opacity-50 text-white font-[900] rounded-3xl shadow-2xl shadow-[var(--ocean-end)]/30 transition transform active:scale-95 text-xs uppercase tracking-[0.2em]"
                        >
                            Finalizar Experiência
                        </button>
                        <p className="text-center text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black">
                            Pagamento Seguro PagBank • v{VERSION}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
