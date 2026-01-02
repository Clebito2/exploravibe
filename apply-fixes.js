// Script de substituição automática
const fs = require('fs');
const path = require('path');

function updateLoginSignupImages(basePath) {
    const loginPath = path.join(basePath, 'apps/client/src/pages/Login.tsx');
    const signupPath = path.join(basePath, 'apps/client/src/pages/SignUp.tsx');

    [loginPath, signupPath].forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');

        // Trocar imagem
        content = content.replace(/src="\/praia2\.jpg"/g, 'src="/pessoas-divertindo.jpg"');

        // Aumentar opacidade
        content = content.replace(/opacity-10/g, 'opacity-30');

        // Ajustar gradiente
        content = content.replace(
            /from-white\/80 via-white\/60 to-white\/90/g,
            'from-white/70 via-white/50 to-white/80'
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
    });
}

function addScrollToDetails(basePath) {
    const detailsPath = path.join(basePath, 'apps/client/src/pages/ExperienceDetails.tsx');
    let content = fs.readFileSync(detailsPath, 'utf8');

    // Add useEffect to imports
    content = content.replace(
        /import { useState } from "react";/,
        'import { useState, useEffect } from "react";'
    );

    // Add scroll effect
    const scrollCode = `
    // Scroll to top when page loads or experience changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);
`;

    content = content.replace(
        /(const \[addingToTrip, setAddingToTrip\] = useState\(false\);)\s*(const experience =)/,
        `$1${scrollCode}\n    $2`
    );

    fs.writeFileSync(detailsPath, content, 'utf8');
    console.log(`✅ Updated: ${detailsPath}`);
}

// Execute
const basePath = 'c:/Users/clebe/OneDrive/Documentos/ProjetosGit/ExploraVibe';
updateLoginSignupImages(basePath);
addScrollToDetails(basePath);

console.log('\\n✅ Todas as correções aplicadas com sucesso!');
