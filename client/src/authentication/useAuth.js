import { useState } from "react";

export const useAuth = () => {
  const [authenticated, setAuthenticatedInternal] = useState(() => {
    return localStorage.getItem("isAuthenticated");
  });

  const setAuthenticated = (isAuth) => {
    localStorage.setItem("isAuthenticated", isAuth);
    setAuthenticatedInternal(isAuth);
  };

  return [authenticated, setAuthenticated];
};