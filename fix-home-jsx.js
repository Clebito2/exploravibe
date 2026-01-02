// Fix JSX error in Home.tsx
const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'apps/client/src/pages/Home.tsx');
let home = fs.readFileSync(homePath, 'utf8');

// O problema é que as linhas 169-170 estão sem \r\n correto
// Vamos restaurar o arquivo e fazer corretamente

// Remover o que foi adicionado errado
home = home.replace('            </div>\n        </main>\n', '        </main>\r\n');

// Agora adicionar corretamente no início
home = home.replace(
    /<main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden relative">/,
    `<main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden relative">
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

// E fechar ANTES de </main>
home = home.replace(
    /(\s+)<Footer \/>\r\n\s+<\/main>/,
    `$1<Footer />
            </div>
        </main>`
);

fs.writeFileSync(homePath, home, 'utf8');
console.log('✅ Home.tsx corrigido!');
