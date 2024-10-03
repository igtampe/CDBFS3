import { useWindowDimensions } from "../hooks/useWindowDimensions";

export default function EmptyFolder() {

    const { vertical } = useWindowDimensions();

    return <div style={{ textAlign: 'center', display: "flex", height: "100%", justifyContent: "center", flexDirection: "column", padding: vertical ? "40px 0px" : "0px" }}>
        <div style={{ width: "64px", margin: "0 auto" }}><img src="watermarkIcon.png" width={64} /></div>
        <div style={{ marginTop: "20px" }}>Folder is empty!</div>
    </div>
}