import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("id");
    if (id) {
      setCurrentUser(id);
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
