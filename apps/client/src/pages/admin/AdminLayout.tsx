import { useAuth } from "@/lib/AuthContext";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";

// For dev/demo purposes, we might want to log the user email to debug
const ADMIN_EMAILS = ["cleber.ihs@gmail.com", "admin@exploravibe.com"];


const SIDEBAR_ITEMS = [
    { name: "Dashboard", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Experiências", href: "/admin/experiencias", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

export default function AdminLayout() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
            </div>
        );
    }

    if (user && !isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
                <h1 className="text-3xl font-black text-red-600 mb-4">ACESSO NEGADO 🚫</h1>
                <p className="text-ocean font-bold mb-2">Você está logado como:</p>
                <code className="bg-white px-4 py-2 rounded border border-red-200 text-lg mb-6 block">
                    {user.email}
                </code>
                <p className="text-sm text-gray-500 mb-8 max-w-md">
                    Este email não está na lista de administradores.<br />
                    Emails permitidos: {ADMIN_EMAILS.join(", ")}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-ocean text-white rounded-xl font-bold"
                    >
                        Voltar ao Início
                    </button>
                    <button
                        onClick={() => navigate("/login?redirect=/admin")}
                        className="px-6 py-3 bg-white border border-ocean text-ocean rounded-xl font-bold"
                    >
                        Trocar Conta
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect logic handled by useEffect, but render null to avoid flash
        return null;
    }

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="flex pt-20">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-ocean text-white p-6 fixed left-0 top-20 z-40">
                    <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Painel Admin</p>
                    </div>

                    <nav className="space-y-2">
                        {SIDEBAR_ITEMS.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isActive ? "bg-white/10" : "hover:bg-white/5"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="absolute bottom-6 left-6 right-6">
                        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar ao Site
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-grow ml-64 p-12 min-h-[calc(100vh-80px)]">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}
