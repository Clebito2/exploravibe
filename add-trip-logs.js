// Adicionar MUITOS logs para debug
const fs = require('fs');
const path = require('path');

console.log('🔧 Adicionando logs de debug...\n');

// 1. TripContext - logs na query
const tripContextPath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let tripContext = fs.readFileSync(tripContextPath, 'utf8');

// Adicionar log no useEffect que busca trips
tripContext = tripContext.replace(
    'const unsubscribe = onSnapshot(',
    `console.log("🔵 SETUP TRIPS LISTENER - user:", user?.uid, user?.email);
        
        const unsubscribe = onSnapshot(`
);

tripContext = tripContext.replace(
    '(snapshot) => {',
    `(snapshot) => {
                console.log("📦 TRIPS SNAPSHOT - size:", snapshot.size);
                snapshot.docs.forEach(doc => {
                    console.log("  - Trip:", doc.id, doc.data());
                });`
);

fs.writeFileSync(tripContextPath, tripContext, 'utf8');
console.log('✅ TripContext com logs');

// 2. TripList - logs no handleCreate
const tripListPath = path.join(__dirname, 'apps/client/src/pages/TripList.tsx');
let tripList = fs.readFileSync(tripListPath, 'utf8');

tripList = tripList.replace(
    'const handleCreate = async (e: React.FormEvent) => {',
    `const handleCreate = async (e: React.FormEvent) => {
        console.log("🚀 HANDLE CREATE START - name:", newTripName);`
);

tripList = tripList.replace(
    'await createTrip(newTripName);',
    `const tripId = await createTrip(newTripName);
            console.log("✅ CREATE TRIP RETURNED ID:", tripId);`
);

tripList = tripList.replace(
    'setNewTripName("");',
    `console.log("🎉 TRIP CREATED SUCCESS!");
            setNewTripName("");`
);

tripList = tripList.replace(
    'console.error(e);',
    `console.error("❌ CREATE TRIP ERROR:", e);`
);

fs.writeFileSync(tripListPath, trip List, 'utf8');
console.log('✅ TripList com logs');

console.log('\n✅ LOGS ADICIONADOS!');
console.log('📋 Console vai mostrar:');
console.log('  1. Setup do listener');
console.log('  2. Quantos trips vêm do Firestore');
console.log('  3. Se createTrip retorna ID');
console.log('  4. Qualquer erro');
