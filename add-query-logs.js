// Adicionar logs completos na query de trips
const fs = require('fs');
const path = require('path');

const tripContextPath = path.join(__dirname, 'apps/client/src/lib/TripContext.tsx');
let content = fs.readFileSync(tripContextPath, 'utf8');

// Substituir o useEffect que faz onSnapshot
content = content.replace(
    /const unsubscribe = onSnapshot\(q, \(snapshot\) => \{/,
    `console.log("🔵 QUERYING TRIPS - user.uid:", user.uid);
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("📦 TRIPS SNAPSHOT RECEIVED:");
            console.log("  - Size:", snapshot.size);
            console.log("  - Empty:", snapshot.empty);
            snapshot.docs.forEach((doc, index) => {
                console.log(\`  [\${index}] Trip ID:\`, doc.id);
                console.log(\`  [\${index}] Data:\`, doc.data());
            });`
);

fs.writeFileSync(tripContextPath, content, 'utf8');
console.log('✅ TripContext com logs na query');
