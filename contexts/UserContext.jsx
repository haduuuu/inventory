import { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        isAuthenticated: false,
        email: null,
        username: null,
    });

    const login = async (email, password) => {
        // Login logic here
        setUser({
            isAuthenticated: true,
            email,
            username: email.split('@')[0],
        });
    };

    const register = async (email, password) => {
        // Register logic here
        setUser({
            isAuthenticated: true,
            email,
            username: email.split('@')[0],
        });
    };

    const logout = () => {
        setUser({
            isAuthenticated: false,
            email: null,
            username: null,
        });
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};
