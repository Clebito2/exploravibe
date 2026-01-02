// Mostrar user.uid no alert ao criar
const fs = require('fs');
const path = require('path');

const tripListPath = path.join(__dirname, 'apps/client/src/pages/TripList.tsx');
let content = fs.readFileSync(tripListPath, 'utf8');

// Modificar alert para mostrar user.uid também
content = content.replace(
    /alert\(`✅ Roteiro "\$\{newTripName\}" criado com sucesso! ID: \$\{tripId\}`\);/,
    `const currentUid = user?.uid || "NO UID";
            alert(\`✅ Roteiro "\${newTripName}" criado!\\n\\nTrip ID: \${tripId}\\nSeu UID: \${currentUid}\\n\\nVERIFIQUE se seu UID está em memberIds no Firebase Console!\`);
            console.log("🔥 TRIP CREATED:", { tripId, userUid: currentUid });`
);

fs.writeFileSync(tripListPath, content, 'utf8');
console.log('✅ TripList mostra UID no alert');

// Também adicionar no TripContext
const tripContextPath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let tripContent = fs.readFileSync(tripContextPath, 'utf8');

// Adicionar log do UID sendo inserido
tripContent = tripContent.replace(
    /memberIds: \[String\(user\.uid\)\],/,
    `memberIds: [String(user.uid)],
                // DEBUG: Log what UID is being added
                ...(console.log("🔥 CREATING TRIP - Adding UID to memberIds:", String(user.uid)) || {}),`
);

fs.writeFileSync(tripContextPath, tripContent, 'utf8');
console.log('✅ TripContext loga UID sendo adicionado');
