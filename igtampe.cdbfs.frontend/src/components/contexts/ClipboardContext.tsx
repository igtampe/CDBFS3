import { createContext, useState } from "react";

export class ClipboardContextType{
    public constructor(
        public clipboard : Clipboard,
        public setClipboard : (val:Clipboard)=>void
    
    ){}
}

export const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

export const ClipboardProvider = (props:{children:any}) => {

    const [clipboard, setClipboard] = useState(undefined as any as Clipboard)

    return <ClipboardContext.Provider value={{clipboard,setClipboard}}>
        {props.children}
    </ClipboardContext.Provider>

}