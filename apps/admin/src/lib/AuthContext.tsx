"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile } from "@exploravibe/shared";

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: User | null;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    isAdmin: false,
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

        const unsubscribeDoc = onSnapshot(
            doc(db, "users", firebaseUser.uid),
            (docSnap) => {
                if (docSnap.exists()) {
                    setUser(docSnap.data() as UserProfile);
                } else {
                    setUser(null);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Firestore auth error:", error);
                setUser(null);
                setLoading(false);
            }
        );

        return () => unsubscribeDoc();
    }, [firebaseUser]);

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
