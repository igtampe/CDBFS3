import { useContext } from "react";
import { ClipboardContext, ClipboardContextType } from "../contexts/ClipboardContext";

export const useClipboard = () => {
  const context = useContext(ClipboardContext);
  if (!context) { throw new Error('AAAA!'); }
  return context as ClipboardContextType;
};