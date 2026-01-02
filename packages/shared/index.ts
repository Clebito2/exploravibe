export const VERSION = "0.1.0";

export type UserRole = "admin" | "customer" | "operator";

export interface UserPreferences {
    interests: string[]; // e.g., ["sertanejo", "ecoturismo", "familia"]
    budget: "baixo" | "medio" | "alto";
    dietaryRestrictions?: string[];
    accessibilityRequired: boolean;
    religion?: string; // Optional, sensitive data
    travelStyle: "aventureiro" | "relaxado" | "cultural" | "festivo";
}

export interface UserConsent {
    personalization: boolean; // Consent for tracking preferences
    marketing: boolean;
    sensitiveData: boolean; // Consent for religion/health info
    location: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    phoneNumber?: string;
    preferences?: UserPreferences;
    consent: UserConsent;
    createdAt: string;
    updatedAt: string;
}

export interface Destination {
    id: string;
    name: string; // e.g., "Recife", "Goiânia"
    description: string;
    imageUrl: string;
    slug: string;
}

export interface Experience {
    id: string;
    destinationId: string;
    title: string;
    description: string;
    longDescription: string;
    price: number;
    currency: "BRL";
    images: string[];
    category: "Gastronomia" | "Cultura" | "Aventura" | "Lazer";
    rating: number;
    reviewCount: number;
    duration?: string;
    location: {
        address: string;
        city: string;
        state: string;
    };
    commissionRate: number; // e.g., 0.12 for 12%
}

export interface TripMember {
    userId: string;
    role: "owner" | "editor" | "viewer";
    joinedAt: string;
}

export interface Trip {
    id: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    members: TripMember[];
    experienceIds: string[]; // List of experiences planned for this trip
    status: "planning" | "confirmed" | "completed";
    createdAt: string;
    updatedAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    experienceId: string;
    destinationId: string;
    tripId?: string; // Optional: Link booking to a specific trip
    date: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    totalAmount: number;
    commissionAmount: number;
    travelers: number;
    paymentId?: string;
    paymentStatus?: "pending" | "authorized" | "paid" | "declined";
    createdAt: string;
}

export interface Review {
    id: string;
    experienceId: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    rating: 1 | 2 | 3 | 4 | 5;
    title: string;
    comment: string;
    visitDate: string;
    travelerType: "solo" | "casal" | "familia" | "amigos" | "negocios";
    photos?: string[];
    helpful: number;
    createdAt: string;
}
