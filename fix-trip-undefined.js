// Script para corrigir DEFINITIVAMENTE o erro de createTrip
const fs = require('fs');
const path = require('path');

const tripContextPath = 'c:/Users/clebe/OneDrive/Documentos/ProjetosGit/ExploraVibe/apps/client/src/lib/TripContext.tsx';

let content = fs.readFileSync(tripContextPath, 'utf8');

// Encontrar a função createTrip e substituir completamente
const oldCreateTrip = /const createTrip = async \(name: string, description\?: string\) => {[\s\S]*?};/;

const newCreateTrip = `const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        try {
            // Build trip data WITHOUT any undefined fields
            // Firestore rejects ANY undefined value in nested objects too
            const tripData = {
                name,
                description: description || "",
                members: [{
                    userId: user.uid,
                    role: "owner" as const,
                    joinedAt: new Date().toISOString(),
                    // Only add optional fields if they exist
                    ...(user.displayName && { displayName: user.displayName }),
                    ...(user.email && { email: user.email }),
                    ...(user.photoURL && { photoURL: user.photoURL })
                }],
                memberIds: [user.uid],
                experienceIds: [],
                status: "planning" as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
                // DO NOT include startDate or endDate - they are optional and undefined
            };

            const docRef = await addDoc(collection(db, "trips"), tripData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };`;

content = content.replace(oldCreateTrip, newCreateTrip);

fs.writeFileSync(tripContextPath, content, 'utf8');
console.log('✅ TripContext atualizado - erro de undefined CORRIGIDO!');
