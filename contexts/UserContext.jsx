import { useState, createContext, useEffect } from "react";
import { account } from "../lib/appwrite";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Initial silent check on bootup
    useEffect(() => {
        async function checkInitialAuth() {
            try {
                const currentSession = await account.get();
                setUser(currentSession);
            } catch (error) {
                setUser(null);
            } finally {
                setAuthChecked(true);
            }
        }
        checkInitialAuth();
    }, []);

    async function login(email, password) {
        try {
            try {
                await account.deleteSession("current");
            } catch (e) { }

            await account.createEmailPasswordSession(email, password);
            const response = await account.get();
            setUser(response);
        } catch (error) {
            console.error("Login Error:", error.message);
            throw new Error(error.message || "Error logging in");
        }
    }

    async function register(email, password) {
        try {
            // Create a new account
            const newAccount = await account.create('unique()', email, password);
            // Log in the new account
            await account.createEmailPasswordSession(email, password);
            const response = await account.get();
            setUser(response);
        } catch (error) {
            console.error("Register Error:", error.message);
            throw new Error(error.message || "Error registering user");
        }
    }

    async function logout() {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    }

    return (
        <UserContext.Provider value={{ user, authChecked, login, logout, register }}>
            {children}
        </UserContext.Provider>
    );
}