import { MOCK_EXPERIENCES } from "@/lib/mockData";
import { Metadata } from "next";
import ExperienceDetailsClient from "./ClientView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const id = params.id;
    const experience = MOCK_EXPERIENCES.find((e) => e.id === id);

    if (!experience) {
        return {
            title: "Experiência não encontrada | ExploraVibe",
        };
    }

    return {
        title: `${experience.title} | ExploraVibe`,
        description: experience.description,
    };
}

export default async function ExperienceDetails({ params }: { params: { id: string } }) {
    return <ExperienceDetailsClient id={params.id} />;
}
