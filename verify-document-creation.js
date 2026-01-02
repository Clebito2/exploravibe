// Adicionar verificação APÓS criar documento
const fs = require('fs');
const path = require('path');

const tripContextPath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let content = fs.readFileSync(tripContextPath, 'utf8');

// Modificar createTrip para verificar se documento existe após criar
const verifyCreateTrip = `    const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        try {
            console.log("🚀 CREATE TRIP START:", { name, uid: user.uid });
            
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
            
            console.log("✅ addDoc RETURNED ID:", docRef.id);
            
            // VERIFY document was actually created
            const verifyDoc = await getDoc(docRef);
            if (verifyDoc.exists()) {
                console.log("✅ DOCUMENT EXISTS IN FIRESTORE:", verifyDoc.data());
            } else {
                console.error("❌ DOCUMENT NOT FOUND AFTER CREATE!");
            }
            
            return docRef.id;
        } catch (error) {
            console.error("❌ CREATE TRIP ERROR:", error);
            throw error;
        }
    };`;

content = content.replace(
    /const createTrip = async \(name: string, description\?: string\) => \{[\s\S]*?return docRef\.id;[\s\S]*?\} catch \(error\) \{[\s\S]*?throw error;[\s\S]*?\}[\s\S]*?\};/,
    verifyCreateTrip
);

// Adicionar import getDoc
if (!content.includes('getDoc')) {
    content = content.replace(
        'import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";',
        'import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";'
    );
}

fs.writeFileSync(tripContextPath, content, 'utf8');
console.log('✅ TripContext com verificação getDoc()');
console.log('📋 Agora vai mostrar se documento realmente existe');
