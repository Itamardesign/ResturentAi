import { db } from './firebase';
import { collection, doc, getDocs, setDoc, increment, query, orderBy, limit, getDoc, updateDoc } from 'firebase/firestore';
import { DailyView, PopularItem } from '../types';

export const recordMenuView = async (menuId: string) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const statsRef = doc(db, 'menus', menuId, 'analytics', 'daily_views');
        const todayStatsRef = doc(statsRef, 'days', today);

        await setDoc(todayStatsRef, {
            date: today,
            views: increment(1)
        }, { merge: true });
    } catch (error) {
        console.error("Error recording menu view:", error);
    }
};

export const recordItemView = async (menuId: string, itemId: string, itemName: string) => {
    try {
        const itemStatsRef = doc(db, 'menus', menuId, 'analytics', 'item_views');
        const itemDocRef = doc(itemStatsRef, 'items', itemId);

        await setDoc(itemDocRef, {
            name: itemName,
            views: increment(1)
        }, { merge: true });
    } catch (error) {
        console.error("Error recording item view:", error);
    }
};

export const getAnalyticsData = async (menuId: string) => {
    try {
        // Get Daily Views (Last 7 days)
        const dailyRef = collection(db, 'menus', menuId, 'analytics', 'daily_views', 'days');
        const dailyQuery = query(dailyRef, orderBy('date', 'desc'), limit(7));
        const dailySnap = await getDocs(dailyQuery);

        const dailyViews: DailyView[] = dailySnap.docs.map(doc => ({
            date: doc.data().date,
            views: doc.data().views || 0,
            orders: 0 // Placeholder as we don't track orders yet
        })).reverse();

        // Get Popular Items (Top 5)
        const itemsRef = collection(db, 'menus', menuId, 'analytics', 'item_views', 'items');
        const itemsQuery = query(itemsRef, orderBy('views', 'desc'), limit(5));
        const itemsSnap = await getDocs(itemsQuery);

        const popularItems: PopularItem[] = itemsSnap.docs.map(doc => ({
            name: doc.data().name,
            views: doc.data().views || 0
        }));

        // Calculate Totals
        const totalViews = dailyViews.reduce((acc, curr) => acc + curr.views, 0);

        return {
            dailyViews,
            popularItems,
            totalViews
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return {
            dailyViews: [],
            popularItems: [],
            totalViews: 0
        };
    }
};
