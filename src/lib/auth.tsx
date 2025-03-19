import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { checkIfCredsAreValid } from "./check-creds";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (apiUrl: string, apiKey: string): Promise<boolean> => {
    const isValid = await checkIfCredsAreValid(apiUrl, apiKey);
    if (isValid) {
      // set the auth to true
      // need to wait for localStorage to be set
      await new Promise((resolve) => {
        localStorage.setItem("auth", "true");
        localStorage.setItem("apiUrl", apiUrl);
        localStorage.setItem("apiKey", apiKey);
        resolve(true);
      });
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("apiUrl");
    localStorage.removeItem("apiKey");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
