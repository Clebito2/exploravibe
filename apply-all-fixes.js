// Script final para aplicar TODAS as modificações
const fs = require('fs');
const path = require('path');

// 1. README.md - Adicionar guidelines
console.log('1. Adicionando guidelines ao README...');
const readmePath = path.join(__dirname, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');

const readmeAddition = `
## 📋 Development Guidelines

### Formatação de Arquivos
**Problema:** O sistema usa \`\\r\\n\` (Windows) causando falhas em edições.

**Solução:**
- Editar via scripts Node.js com \`fs.readFileSync/writeFileSync\`
- Incluir \`\\r\\n\` exato no pattern matching
- Usar regex quando possível

### Análise de Impacto (OBRIGATÓRIO)

Antes de implementar QUALQUER mudança, analisar:

1. **Segurança:** Exposição de dados? Validações? Regras Firestore?
2. **UX:** Melhora experiência? Feedback visual? Loading states?
3. **Performance:** Impacto em queries? Otimização de assets?

### Padrões de Código

#### Firestore: NUNCA enviar \`undefined\`
\`\`\`typescript
// ❌ ERRADO
const data = { field: optionalValue };

// ✅ CORRETO
const data = { field: optionalValue || "" };
\`\`\`

#### Firebase Storage: Paths
\`\`\`
profiles/{userId}/{timestamp}_{filename}
experiences/{timestamp}_{filename}
\`\`\`

`;

readme = readme.replace('---\r\n*ExploraVibe:', `${readmeAddition}---\r\n*ExploraVibe:`);
fs.writeFileSync(readmePath, readme, 'utf8');
console.log('✅ README.md atualizado');

// 2. NewExperience.tsx - Melhorar validação
console.log('\n2. Melhorando validações de upload em NewExperience...');
const newExpPath = path.join(__dirname, 'apps/client/src/pages/admin/NewExperience.tsx');
let newExp = fs.readFileSync(newExpPath, 'utf8');

const newHandle = `    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('❌ O arquivo deve ser uma imagem');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ A imagem deve ter no máximo 5MB');
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, \`experiences/\${Date.now()}_\${file.name}\`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            alert('✅ Upload concluído com sucesso!');
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(\`❌ Erro ao fazer upload: \${error.message || 'Falha desconhecida'}\`);
        } finally {
            setUploading(false);
        }
    };`;

newExp = newExp.replace(
    /const handleImageUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?setUploading\(false\);[\s\S]*?\}[\s\S]*?\};/,
    newHandle
);

fs.writeFileSync(newExpPath, newExp, 'utf8');
console.log('✅ NewExperience.tsx atualizado');

// 3. Home.tsx - Adicionar background
console.log('\n3. Adicionando background image na Home...');
const homePath = path.join(__dirname, 'apps/client/src/pages/Home.tsx');
let home = fs.readFileSync(homePath, 'utf8');

// Procurar o return da função Home e adicionar background
home = home.replace(
    'return (\r\n        <main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden">',
    `return (
        <main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden relative">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="/restderua.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90"></div>
            </div>

            {/* Content with higher z-index */}
            <div className="relative z-10">`
);

// Fechar a div adicional antes do </main>
home = home.replace(
    '        </main>\r\n    );',
    `            </div>
        </main>
    );`
);

fs.writeFileSync(homePath, home, 'utf8');
console.log('✅ Home.tsx atualizado');

console.log('\n✅ TODAS as modificações aplicadas com sucesso!');
console.log('\n📋 Resumo:');
console.log('  1. README.md: Guidelines adicionados');
console.log('  2. NewExperience.tsx: Validações melhoradas');
console.log('  3. Home.tsx: Background image adicionado');
console.log('  4. restderua.jpg: Copiado para public/');
