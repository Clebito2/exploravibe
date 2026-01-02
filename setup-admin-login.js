// Script para configurar login separado admin/comum
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando login separado...\n');

// 1. Atualizar App.tsx - adicionar rota AdminLogin
console.log('1. Atualizando App.tsx...');
const appPath = path.join(__dirname, 'apps/client/src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

// Adicionar import
if (!app.includes('AdminLogin')) {
    app = app.replace(
        "import AdminLayout from './pages/admin/AdminLayout'",
        "import AdminLayout from './pages/admin/AdminLayout'\nimport AdminLogin from './pages/admin/AdminLogin'"
    );

    // Adicionar rota
    app = app.replace(
        '      {/* Admin Routes */}',
        `      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes */}`
    );

    fs.writeFileSync(appPath, app, 'utf8');
    console.log('✅ App.tsx atualizado');
} else {
    console.log('✅ App.tsx já atualizado');
}

// 2. Atualizar Login.tsx
console.log('\n2. Atualizando Login.tsx...');
const loginPath = path.join(__dirname, 'apps/client/src/pages/Login.tsx');
let login = fs.readFileSync(loginPath, 'utf8');

// Substituir handleEmailLogin
login = login.replace(
    /const handleEmailLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\S]*?\};/,
    `const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Login comum SEMPRE vai para Home
            navigate("/", { replace: true });
        } catch (err: any) {
            console.error("Login Error:", err.code);
            setError(mapAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };`
);

// Substituir handleGoogleLogin
login = login.replace(
    /const handleGoogleLogin = async \(\) => \{[\s\S]*?const provider = new GoogleAuthProvider\(\);[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\S]*?\};/,
    `const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Login comum SEMPRE vai para Home
            navigate("/", { replace: true });
        } catch (err: any) {
            console.error("Google Login Error:", err.code);
            setError(mapAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };`
);

// Mudar link de Área Restrita
login = login.replace(
    'to="/admin"',
    'to="/admin/login"'
);

fs.writeFileSync(loginPath, login, 'utf8');
console.log('✅ Login.tsx atualizado');

// 3. Atualizar AdminLayout para NÃO redirecionar para /login
console.log('\n3. Atualizando AdminLayout.tsx...');
const adminLayoutPath = path.join(__dirname, 'apps/client/src/pages/admin/AdminLayout.tsx');
let adminLayout = fs.readFileSync(adminLayoutPath, 'utf8');

adminLayout = adminLayout.replace(
    '/login?redirect=',
    '/admin/login?redirect='
);

fs.writeFileSync(adminLayoutPath, adminLayout, 'utf8');
console.log('✅ AdminLayout.tsx atualizado');

console.log('\n✅ TODAS as configurações aplicadas!');
console.log('\n📋 Resumo:');
console.log('  1. App.tsx: rota /admin/login adicionada');
console.log('  2. Login.tsx: sempre vai para Home (/)');
console.log('  3. AdminLayout.tsx: redireciona para /admin/login');
console.log('  4. AdminLogin.tsx: criado anteriormente');
