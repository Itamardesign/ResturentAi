import { db } from "./firebase";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

// --- Types (You might want to move these to a types file later) ---
export interface UserProfile {
    email: string;
    displayName?: string;
    photoURL?: string;
    // Add other user preferences here
}

export interface Menu {
    id?: string;
    userId: string;
    name: string;
    description?: string;
    items: string[]; // Array of Dish IDs
    designId?: string;
    createdAt: number;
    updatedAt: number;
}

export interface Dish {
    id?: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
    createdAt: number;
}

export interface Design {
    id?: string;
    userId: string;
    name: string;
    theme: any; // JSON object for theme properties
    createdAt: number;
}

// --- User Profile ---

export const saveUserProfile = async (userId: string, data: UserProfile) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, data, { merge: true });
        console.log("User profile saved successfully");
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
};

export const getUserProfile = async (userId: string) => {
    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            console.log("No such user profile!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

// --- Menus ---

export const saveMenu = async (userId: string, menuData: Omit<Menu, "id" | "userId" | "createdAt" | "updatedAt"> & { id?: string }) => {
    try {
        const timestamp = Date.now();
        const data = {
            ...menuData,
            userId,
            updatedAt: timestamp,
        };

        if (menuData.id) {
            // Update existing
            const menuRef = doc(db, "menus", menuData.id);
            await updateDoc(menuRef, data);
            return menuData.id;
        } else {
            // Create new
            const menusRef = collection(db, "menus");
            const docRef = await addDoc(menusRef, { ...data, createdAt: timestamp });
            return docRef.id;
        }
    } catch (error) {
        console.error("Error saving menu:", error);
        throw error;
    }
};

export const getMenus = async (userId: string) => {
    try {
        const menusRef = collection(db, "menus");
        const q = query(menusRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Menu));
    } catch (error) {
        console.error("Error getting menus:", error);
        throw error;
    }
};

// --- Dishes ---

export const saveDish = async (userId: string, dishData: Omit<Dish, "id" | "userId" | "createdAt"> & { id?: string }) => {
    try {
        const timestamp = Date.now();
        const data = {
            ...dishData,
            userId,
        };

        if (dishData.id) {
            const dishRef = doc(db, "dishes", dishData.id);
            await updateDoc(dishRef, data);
            return dishData.id;
        } else {
            const dishesRef = collection(db, "dishes");
            const docRef = await addDoc(dishesRef, { ...data, createdAt: timestamp });
            return docRef.id;
        }
    } catch (error) {
        console.error("Error saving dish:", error);
        throw error;
    }
};

export const getDishes = async (userId: string) => {
    try {
        const dishesRef = collection(db, "dishes");
        const q = query(dishesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dish));
    } catch (error) {
        console.error("Error getting dishes:", error);
        throw error;
    }
};

// --- Designs ---

export const saveDesign = async (userId: string, designData: Omit<Design, "id" | "userId" | "createdAt"> & { id?: string }) => {
    try {
        const timestamp = Date.now();
        const data = {
            ...designData,
            userId,
        };

        if (designData.id) {
            const designRef = doc(db, "designs", designData.id);
            await updateDoc(designRef, data);
            return designData.id;
        } else {
            const designsRef = collection(db, "designs");
            const docRef = await addDoc(designsRef, { ...data, createdAt: timestamp });
            return docRef.id;
        }
    } catch (error) {
        console.error("Error saving design:", error);
        throw error;
    }
};

export const getDesigns = async (userId: string) => {
    try {
        const designsRef = collection(db, "designs");
        const q = query(designsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Design));
    } catch (error) {
        console.error("Error getting designs:", error);
        throw error;
    }
};
