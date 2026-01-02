"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Experience } from "@exploravibe/shared";

export interface CartItem {
    id: string; // Cart-specific ID (expId + date)
    experience: Experience;
    date: string;
    travelers: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (experience: Experience, date: string, travelers: number) => void;
    removeFromCart: (cartItemId: string) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("exploravibe_cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem("exploravibe_cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (experience: Experience, date: string, travelers: number) => {
        const cartItemId = `${experience.id}-${date}`;
        setItems((prev) => {
            const existing = prev.find((i) => i.id === cartItemId);
            if (existing) {
                return prev.map((i) =>
                    i.id === cartItemId ? { ...i, travelers: i.travelers + travelers } : i
                );
            }
            return [...prev, { id: cartItemId, experience, date, travelers }];
        });
    };

    const removeFromCart = (cartItemId: string) => {
        setItems((prev) => prev.filter((i) => i.id !== cartItemId));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((acc, item) => acc + item.experience.price * item.travelers, 0);
    const itemCount = items.length;

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
