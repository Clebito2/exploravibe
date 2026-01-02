// CORREÇÃO DEFINITIVA - ZERO CHANCE DE UNDEFINED
const fs = require('fs');
const path = require('path');

const tripContextPath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let content = fs.readFileSync(tripContextPath, 'utf8');

// VERSÃO ULTRA SIMPLIFICADA - CAMPOS HARDCODED
const ultraSimpleCreateTrip = `    const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        try {
            // ULTRA SIMPLIFIED - NO OPTIONAL FIELDS AT ALL
            const docRef = await addDoc(collection(db, "trips"), {
                name: String(name),
                description: String(description || ""),
                members: [{
                    userId: String(user.uid),
                    role: "owner",
                    joinedAt: String(new Date().toISOString())
                }],
                memberIds: [String(user.uid)],
                experienceIds: [],
                status: "planning",
                createdAt: String(new Date().toISOString()),
                updatedAt: String(new Date().toISOString())
            });
            
            return docRef.id;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };`;

// Substituir
content = content.replace(
    /const createTrip = async \(name: string, description\?: string\) => \{[\s\S]*?return docRef\.id;[\s\S]*?\} catch \(error\) \{[\s\S]*?throw error;[\s\S]*?\}[\s\S]*?\};/,
    ultraSimpleCreateTrip
);

fs.writeFileSync(tripContextPath, content, 'utf8');
console.log('✅ TripContext ULTRA SIMPLIFICADO');
console.log('✅ TODOS os campos convertidos para String()');
console.log('✅ ZERO possibilidade de undefined');
