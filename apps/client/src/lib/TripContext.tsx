"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Trip, TripMember } from "@exploravibe/shared";
import { db } from "./firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, arrayUnion, where } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface TripContextType {
    trips: Trip[];
    createTrip: (name: string, description?: string) => Promise<string>;
    addToTrip: (tripId: string, experienceId: string) => Promise<void>;
    loading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTrips([]);
            setLoading(false);
            return;
        }

        // Query trips where the user is a member
        // Note: This requires a specific structure or multiple queries, 
        // but for MVP we search by owner or use a flattened member UIDs list.
        // For now, let's assume we filter client-side or use a simpler owner check.
        const q = query(
            collection(db, "trips"),
            where("memberIds", "array-contains", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
            setTrips(userTrips);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching trips:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const createTrip = async (name: string, description?: string) => {
        if (!user) throw new Error("Must be logged in");

        const newMember: TripMember = {
            userId: user.uid,
            role: "owner",
            joinedAt: new Date().toISOString()
        };

        try {
            const docRef = await addDoc(collection(db, "trips"), {
                name,
                description,
                members: [newMember],
                memberIds: [user.uid], // Optimized for querying
                experienceIds: [],
                status: "planning",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };

    const addToTrip = async (tripId: string, experienceId: string) => {
        const tripRef = doc(db, "trips", tripId);
        await updateDoc(tripRef, {
            experienceIds: arrayUnion(experienceId),
            updatedAt: new Date().toISOString()
        });
    };

    return (
        <TripContext.Provider value={{ trips, createTrip, addToTrip, loading }}>
            {children}
        </TripContext.Provider>
    );
};

export const useTrips = () => {
    const context = useContext(TripContext);
    if (!context) throw new Error("useTrips must be used within TripProvider");
    return context;
};
