"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: any;
  setUser: (user: any) => void;
  status: "loading" | "login" | "logout";
  logout: () => void;
  fetchUserData: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "login" | "logout">(
    "loading"
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserData = async (token: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/profile`,
        config
      );
      setUser(response.data.data);
      setStatus("login");
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (axios.isAxiosError(error)) {
        if (error.status !== 500) {
          Cookies.remove("session_token");
        }
      }
      setToken(null);
      setUser(null);
      setStatus("logout");
    }
  };

  const logout = () => {
    setStatus("logout");
    Cookies.remove("session_token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const storedToken = Cookies.get("session_token");

      if (storedToken) {
        setToken(storedToken);
        fetchUserData(storedToken);
      } else {
        setStatus("logout");
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      if (token) {
        Cookies.set("session_token", token, { expires: 3 });
        fetchUserData(token);
      }
    }
  }, [token, isInitialized]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, status, logout, fetchUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
