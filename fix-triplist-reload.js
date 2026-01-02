// Fix TripList - adicionar alert e reload
const fs = require('fs');
const path = require('path');

const tripListPath = path.join(__dirname, 'apps/client/src/pages/TripList.tsx');
let content = fs.readFileSync(tripListPath, 'utf8');

// Substituir handleCreate
content = content.replace(
    /const handleCreate = async \(e: React\.FormEvent\) => \{[\s\S]*?setIsCreating\(false\);[\s\S]*?\}[\s\S]*?\};/,
    `const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTripName) return;
        setIsCreating(true);
        try {
            const tripId = await createTrip(newTripName);
            alert(\`✅ Roteiro "\${newTripName}" criado com sucesso! ID: \${tripId}\`);
            setNewTripName("");
            // Force reload to show new trip
            window.location.reload();
        } catch (e: any) {
            console.error("Create trip error:", e);
            alert(\`❌ Erro ao criar roteiro: \${e.message || e.code || "Erro desconhecido"}\`);
        } finally {
            setIsCreating(false);
        }
    };`
);

fs.writeFileSync(tripListPath, content, 'utf8');
console.log('✅ TripList.tsx atualizado com alert e reload');
