import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Menu } from '../types';
import { INITIAL_MENU } from '../constants';

export const saveMenu = async (userId: string, menu: Menu) => {
    try {
        const menuRef = doc(db, 'menus', userId);
        // Save the menu with the userId as the document ID
        // We also add a timestamp
        await setDoc(menuRef, { ...menu, updatedAt: Date.now() }, { merge: true });
        console.log('Menu saved successfully');
    } catch (error) {
        console.error('Error saving menu:', error);
        throw error;
    }
};

export const getMenu = async (userId: string): Promise<Menu | null> => {
    try {
        const menuRef = doc(db, 'menus', userId);
        const docSnap = await getDoc(menuRef);

        if (docSnap.exists()) {
            return docSnap.data() as Menu;
        } else {
            console.log('No menu found for user, returning null');
            return null;
        }
    } catch (error) {
        console.error('Error getting menu:', error);
        throw error;
    }
};
