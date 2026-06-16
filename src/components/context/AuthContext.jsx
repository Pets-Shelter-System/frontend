import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const [userId, setUserId] = useState(null);

    // decode token → extract userId
    useEffect(() => {
        if (!token) {
            setUserId(null);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.uid);
        } catch (err) {
            console.error("Invalid token format");
            setUserId(null);
        }
    }, [token]);

    const login = useCallback((authData) => {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData));

        setToken(authData.token);
        setUser(authData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
        setUserId(null);
    }, []);

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setUser,
                userId,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
