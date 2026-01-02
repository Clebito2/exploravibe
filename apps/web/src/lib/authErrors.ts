export const mapAuthError = (code: string): string => {
    switch (code) {
        case "auth/email-already-in-use":
            return "Este e-mail já está em uso. Que tal tentar fazer login?";
        case "auth/invalid-email":
            return "O e-mail digitado não parece ser válido.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "E-mail ou senha incorretos. Verifique e tente novamente.";
        case "auth/weak-password":
            return "Essa senha é muito fraca. Tente uma com pelo menos 6 caracteres.";
        case "auth/popup-closed-by-user":
            return "O login foi cancelado.";
        case "auth/network-request-failed":
            return "Erro de conexão. Verifique sua internet.";
        default:
            return "Ops! Ocorreu um erro inesperado. Tente novamente em instantes.";
    }
};
