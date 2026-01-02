"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserProfile } from "@exploravibe/shared";

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
            setFirebaseUser(fbUser);
            if (!fbUser) {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!firebaseUser) return;

        // Listen to Firestore document for real-time profile updates
        const unsubscribeDoc = onSnapshot(
            doc(db, "users", firebaseUser.uid),
            (docSnap) => {
                if (docSnap.exists()) {
                    setUser(docSnap.data() as UserProfile);
                } else {
                    // Fallback for new users or missing docs
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || "",
                        displayName: firebaseUser.displayName || "Explorador",
                        photoURL: firebaseUser.photoURL || undefined,
                        role: "customer",
                        consent: { personalization: false, marketing: false, sensitiveData: false, location: false },
                        preferences: { interests: [], budget: "medio", travelStyle: "cultural", accessibilityRequired: false },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                }
                setLoading(false);
            },
            (error) => {
                // Handle permission denied or other errors
                console.error("Firestore auth error:", error);
                // Create fallback user from Firebase auth data
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || "Explorador",
                    photoURL: firebaseUser.photoURL || undefined,
                    role: "customer",
                    consent: { personalization: false, marketing: false, sensitiveData: false, location: false },
                    preferences: { interests: [], budget: "medio", travelStyle: "cultural", accessibilityRequired: false },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                setLoading(false);
            }
        );

        return () => unsubscribeDoc();
    }, [firebaseUser]);

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
