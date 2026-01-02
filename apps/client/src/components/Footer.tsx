"use client";



export default function Footer() {
    return (
        <footer className="py-6 px-6 border-t border-ocean/5 bg-white/50 backdrop-blur-sm">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <p className="text-[10px] font-bold text-ocean/30 tracking-widest">
                    © 2026 ExploraVibe. Todos os direitos reservados.
                </p>
                <p className="text-[10px] font-bold text-ocean/20 tracking-wide">
                    Desenvolvido por <span className="text-ocean/40">Cléber Donato</span>
                </p>
            </div>
        </footer>
    );
}
