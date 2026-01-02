"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Trip, TripMember } from "@exploravibe/shared";
import { db } from "./firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, arrayUnion, where, getDocs, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface TripContextType {
    trips: Trip[];
    createTrip: (name: string, description?: string) => Promise<string>;
    addToTrip: (tripId: string, experienceId: string) => Promise<void>;
    addMember: (tripId: string, email: string) => Promise<void>;
    loading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Critical: Validate user.uid exists to prevent Firestore query errors
        if (!user || !user.uid) {
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
    };

    const addToTrip = async (tripId: string, experienceId: string) => {
        const tripRef = doc(db, "trips", tripId);
        await updateDoc(tripRef, {
            experienceIds: arrayUnion(experienceId),
            updatedAt: new Date().toISOString()
        });
    };

    const addMember = async (tripId: string, email: string) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("Usuário não encontrado com este email.");
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const newUserId = userDoc.id;

            const tripRef = doc(db, "trips", tripId);
            const newMember: TripMember = {
                userId: newUserId,
                role: "editor",
                joinedAt: new Date().toISOString()
            };

            await updateDoc(tripRef, {
                members: arrayUnion(newMember),
                memberIds: arrayUnion(newUserId),
                updatedAt: new Date().toISOString()
            });
            alert(`Usuário ${email} adicionado com sucesso!`);
        } catch (error) {
            console.error("Error adding member:", error);
            alert("Erro ao adicionar membro.");
            throw error;
        }
    };

    return (
        <TripContext.Provider value={{ trips, createTrip, addToTrip, addMember, loading }}>
            {children}
        </TripContext.Provider>
    );
};

export const useTrips = () => {
    const context = useContext(TripContext);
    if (!context) throw new Error("useTrips must be used within TripProvider");
    return context;
};


