// Adicionar background na Home.tsx - VERSÃO CORRETA
const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'apps/client/src/pages/Home.tsx');
let home = fs.readFileSync(homePath, 'utf8');

// 1 Mudar className do main
home = home.replace(
    '<main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden">',
    '<main className="min-h-screen bg-white pb-32 selection:bg-crystal selection:text-ocean overflow-x-hidden relative">'
);

// 2. Adicionar background DEPOIS do <main> e ANTES do <FlashlightCursor />
home = home.replace(
    '            <FlashlightCursor />',
    `            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="/restderua.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90"></div>
            </div>

            {/* Content with higher z-index */}
            <div className="relative z-10">
            <FlashlightCursor />`
);

// 3. Fechar div ANTES de </main>
home = home.replace(
    '            <Footer />\r\n        </main>',
    `            <Footer />
            </div>
        </main>`
);

fs.writeFileSync(homePath, home, 'utf8');
console.log('✅ Home.tsx atualizado corretamente!');
