// Script para corrigir DEFINITIVAMENTE o erro de createTrip - VERSÃO 2
const fs = require('fs');

const tripContextPath = 'c:/Users/clebe/OneDrive/Documentos/ProjetosGit/ExploraVibe/apps/client/src/lib/TripContext.tsx';

let content = fs.readFileSync(tripContextPath, 'utf8');

// Primeira: Remover spread operator que pode causar undefined
// Segunda: Garantir que description nunca seja undefined
// Terceira: NÃO adicionar startDate/endDate

const searchPattern = `    const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        const newMember: TripMember = {
            userId: user.uid,
            role: "owner",
            joinedAt: new Date().toISOString()
        };

        try {
            // Build trip data without undefined fields (Firestore doesn't accept undefined)
            const tripData: any = {
                name,
                description: description || "", // Fix: Firestore hates undefined
                members: [newMember],
                memberIds: [user.uid],
                experienceIds: [],
                status: "planning",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Only add optional date fields if they exist
            // startDate and endDate will be added later when user sets them

            const docRef = await addDoc(collection(db, "trips"), tripData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };`;

const replacement = `    const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        try {
            // Build trip data WITHOUT any undefined fields
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

if (content.includes(searchPattern)) {
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(tripContextPath, content, 'utf8');
    console.log('✅ TripContext corrigido com sucesso!');
} else {
    console.log('❌ Padrão não encontrado, tentando substituir via regex simples...');
    // Se não encontrar, significa que foi modificado, restaurar primeiro
    console.log('⚠️ Execute: git checkout apps/client/src/lib/TripContext.tsx');
}
