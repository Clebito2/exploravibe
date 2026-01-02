import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload profile photo to Firebase Storage
 * @param userId - User's Firebase UID
 * @param file - Image file to upload
 * @returns Download URL of the uploaded image
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
    try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            throw new Error("O arquivo deve ser uma imagem");
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error("A imagem deve ter no máximo 5MB");
        }

        // Create storage reference with timestamp to avoid conflicts
        const storageRef = ref(storage, `profiles/${userId}/${Date.now()}_${file.name}`);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error: any) {
        console.error("Error uploading image:", error);
        throw new Error(error.message || "Falha no upload da imagem");
    }
}
