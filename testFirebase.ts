import { saveUserProfile, getUserProfile } from "./services/db";

export const runFirebaseTest = async (userId: string) => {
    console.log("Starting Firebase Test for user:", userId);
    const testUserData = {
        email: "test@example.com",
        displayName: "Test User",
    };

    try {
        console.log("Attempting to save user profile...");
        await saveUserProfile(userId, testUserData);
        console.log("User profile saved.");

        console.log("Attempting to get user profile...");
        const fetchedUser = await getUserProfile(userId);
        console.log("Fetched User:", fetchedUser);

        if (fetchedUser && fetchedUser.email === testUserData.email) {
            console.log("FIREBASE_TEST_SUCCESS");
        } else {
            console.error("FIREBASE_TEST_FAILURE: Data mismatch");
        }
    } catch (error) {
        console.error("FIREBASE_TEST_ERROR:", error);
    }
};
