import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-6xl mb-6">🛸</div>
                        <h1 className="text-4xl font-secondary italic text-ocean mb-4">Ops! Algo saiu da órbita.</h1>
                        <p className="text-ocean/60 font-primary mb-8">
                            Encontramos um erro inesperado na interface. Mas não se preocupe, podemos tentar estabilizar sua conexão agora mesmo.
                        </p>
                        <div className="bg-red-50 p-4 rounded-2xl text-left mb-8 border border-red-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Detalhes do erro:</p>
                            <code className="text-xs text-red-500 break-all">{this.state.error?.message}</code>
                        </div>
                        <button
                            onClick={this.handleReset}
                            className="w-full py-5 bg-ocean text-white font-black rounded-2xl shadow-xl shadow-ocean/20 hover:bg-coral transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                        >
                            Resetar & Voltar ao Início ⚡
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
