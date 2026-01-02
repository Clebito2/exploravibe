import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { Experience } from "@exploravibe/shared";
import { MOCK_EXPERIENCES } from "./mockData";

export const useExperiences = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "experiences"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Experience));

            // Merge with mock data if needed, or replace entirely. 
            // For production feel, let's keep mock data ONLY if DB is empty to show something, 
            // OR just switch to full live data. Sticking to live data + logic to fallback is safer.
            // But user wants admin created ones. 

            if (fetched.length === 0) {
                setExperiences(MOCK_EXPERIENCES); // Fallback for demo
            } else {
                setExperiences(fetched);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching experiences:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { experiences, loading };
};
