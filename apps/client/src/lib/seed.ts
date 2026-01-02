import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const destinations = [
    {
        id: "joao-pessoa",
        name: "João Pessoa",
        description: "Onde o sol nasce primeiro. Praias de águas mornas, tranquilidade e o melhor pôr do sol do Nordeste.",
        imageUrl: "https://images.unsplash.com/photo-1599508491090-09757f59d08e",
        slug: "joao-pessoa",
    },
    {
        id: "goiania",
        name: "Goiânia",
        description: "Capital do Art Déco e da gastronomia generosa no coração do Brasil.",
        imageUrl: "https://images.unsplash.com/photo-1582234053229-232677490050",
        slug: "goiania",
    },
];

const experiences = [
    {
        id: "jpa-catamara",
        destinationId: "joao-pessoa",
        title: "Passeio de Catamarã ao Pôr do Sol",
        description: "Navegue para o pôr do sol na Praia do Jacaré ao som do Bolero de Ravel.",
        longDescription: "Uma experiência mística no Rio Paraíba, acompanhando um dos sunsets mais famosos do Brasil com música ao vivo nos catamarãs.",
        price: 120,
        currency: "BRL",
        images: ["https://images.unsplash.com/photo-1599508491090-09757f59d08e"],
        category: "Lazer",
        rating: 4.8,
        reviewCount: 45,
        duration: "2h",
        location: { address: "Praia do Jacaré", city: "João Pessoa", state: "PB" },
        commissionRate: 0.12,
    },
    {
        id: "jpa-picaozinho",
        destinationId: "joao-pessoa",
        title: "Piscinas Naturais de Picãozinho",
        description: "Descubra a vida marinha nas águas cristalinas de João Pessoa.",
        longDescription: "Visite as piscinas naturais que se formam na maré baixa em frente à praia de Tambaú. Ideal para mergulho e contato com a natureza.",
        price: 180,
        currency: "BRL",
        images: ["https://images.unsplash.com/photo-1628109315006-ecc21cb91566"],
        category: "Cultura",
        rating: 4.9,
        reviewCount: 82,
        duration: "4h",
        location: { address: "Praia de Tambaú", city: "João Pessoa", state: "PB" },
        commissionRate: 0.12,
    },
    {
        id: "goiania-art-deco",
        destinationId: "goiania",
        title: "Tour Art Déco Histórico",
        description: "Explore o maior acervo Art Déco de Goiânia em um passeio guiado.",
        longDescription: "Caminhada pelo Centro Histórico, visitando o Teatro Goiânia, Estação Ferroviária e Palácio das Esmeraldas.",
        price: 90,
        currency: "BRL",
        images: ["https://images.unsplash.com/photo-1582234053229-232677490050"],
        category: "Cultura",
        rating: 4.7,
        reviewCount: 28,
        duration: "3h",
        location: { address: "Avenida Goiás", city: "Goiânia", state: "GO" },
        commissionRate: 0.12,
    },
];

export const seedDatabase = async () => {
    try {
        for (const d of destinations) {
            await setDoc(doc(db, "destinations", d.id), d);
        }
        for (const e of experiences) {
            await setDoc(doc(db, "experiences", e.id), e);
        }
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
