// CORREÇÃO DEFINITIVA do erro addDoc() undefined
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Substitui TODA a função createTrip
const pattern = /const createTrip = async \(name: string, description\?: string\) => \{[\s\S]*?return docRef\.id;[\s\S]*?\} catch \(error\) \{[\s\S]*?throw error;[\s\S]*?\}[\s\S]*?\};/;

const replacement = `const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        try {
            // Build trip data WITHOUT any undefined fields
            // Construct members inline to avoid undefined from intermediate variables
            const tripData = {
                name,
                description: description || "",
                members: [{
                    userId: user.uid,
                    role: "owner" as const,
                    joinedAt: new Date().toISOString()
                }],
                memberIds: [user.uid],
                experienceIds: [],
                status: "planning" as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "trips"), tripData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };`;

if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ TripContext.tsx corrigido com sucesso!');
    console.log('✅ Removido: variável newMember intermediária');
    console.log('✅ Adicionado: objeto inline em members[]');
    console.log('✅ Garantido: ZERO campos undefined');
} else {
    console.log('❌ Padrão não encontrado. Arquivo pode já ter sido modificado.');
    console.log('Tentando localizar a função createTrip...');

    const lines = content.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('const createTrip')) {
            console.log(`Linha ${index + 1}: ${line.trim()}`);
        }
    });
}
