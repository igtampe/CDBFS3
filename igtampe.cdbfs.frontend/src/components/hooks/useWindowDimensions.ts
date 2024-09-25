import { useContext } from "react";
import { DimensionsContext } from "../contexts/DimensionsContext";

export const useUser = () => {
    const context = useContext(DimensionsContext);
    if (!context) { throw new Error('AAAA!'); }
    return context;
  };