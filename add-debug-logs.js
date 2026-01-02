// ADICIONAR LOGS DETALHADOS NO TRIPCONTEXT
const fs = require('fs');
const path = require('path');

const tripContextPath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let content = fs.readFileSync(tripContextPath, 'utf8');

// Adicionar logs ANTES do addDoc
const loggedCreateTrip = `    const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        try {
            console.log("🔵 CREATE TRIP - USER:", {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });

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

            console.log("🟢 TRIP DATA (BEFORE addDoc):", JSON.stringify(tripData, null, 2));
            console.log("🔍 CHECKING FOR UNDEFINED:");
            Object.entries(tripData).forEach(([key, value]) => {
                if (value === undefined) {
                    console.error(\`❌ FIELD "\${key}" IS UNDEFINED!\`);
                }
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (typeof item === 'object') {
                            Object.entries(item).forEach(([subKey, subValue]) => {
                                if (subValue === undefined) {
                                    console.error(\`❌ FIELD "\${key}[\${index}].\${subKey}" IS UNDEFINED!\`);
                                }
                            });
                        }
                    });
                }
            });

            const docRef = await addDoc(collection(db, "trips"), tripData);
            console.log("✅ TRIP CREATED SUCCESSFULLY:", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("❌ CREATE TRIP ERROR:", error);
            throw error;
        }
    };`;

// Substituir a função createTrip
content = content.replace(
    /const createTrip = async \(name: string, description\?: string\) => \{[\s\S]*?return docRef\.id;[\s\S]*?\} catch \(error\) \{[\s\S]*?throw error;[\s\S]*?\}[\s\S]*?\};/,
    loggedCreateTrip
);

fs.writeFileSync(tripContextPath, content, 'utf8');
console.log('✅ TripContext.tsx atualizado com LOGS DETALHADOS');
console.log('📋 Agora o console vai mostrar EXATAMENTE qual campo está undefined');
