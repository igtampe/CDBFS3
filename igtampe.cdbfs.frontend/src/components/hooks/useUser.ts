import { useContext } from "react";
import { UserContext } from "../contexts/AuthContext";

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) { throw new Error('AAAA!'); }
    return context;
  };