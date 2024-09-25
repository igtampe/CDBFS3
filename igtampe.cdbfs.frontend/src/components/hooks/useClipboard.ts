import { useContext } from "react";
import { ClipboardContext } from "../contexts/ClipboardContext";

export const useClipboard = () => {
    const context = useContext(ClipboardContext);
    if (!context) { throw new Error('AAAA!'); }
    return context;
  };