import { Card, CardContent } from "@mui/material";
import CdbfsStatistics from "../../model/CdbfsStatistics";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../api/Common";
import SizeDisplay from "../shared/SizeDisplay";

const ChopoBarBackground = `linear-gradient(to right, 
    #57007F 0%, #57007F 16.67%, 
    #7F006E 16.67%, #7F006E 33.34%, 
    #FF006E 33.34%, #FF006E 50.01%, 
    #FF0000 50.01%, #FF0000 66.68%, 
    #FF6A00 66.68%, #FF6A00 83.35%, 
    #FFD800 83.35%, #FFD800 100%)`

export default function HomePane(props: {
    statistics?: CdbfsStatistics
}) {

    const [loadingText, setLoadingText] = useState("Loading...")
    const { statistics } = props

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingText('Spinning up');
        }, 10000); // 10 seconds

        // Cleanup the timer if the component unmounts or loading ends before 30 seconds
        return () => clearTimeout(timer);
    }, []);

    return <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ background: ChopoBarBackground }}>
            <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,.2)", padding: "20px 20px" }}>
            </div>
        </div>
        <CardContent style={{ flex: "1", overflowY: "auto" }}>
            <div style={{ padding: "0px 20px", textAlign: "center", justifyContent: "center", alignContent: "center", display: "flex", alignItems: "center", height: "100%", flexDirection: "column" }}>
                {!statistics
                    ? <>
                        <img src="/loading.gif" width={64} />
                        <div style={{ marginTop: "20px" }}>{loadingText}</div>
                    </>
                    : <>
                        <img src="/icon.png" width={64} />
                        <div style={{ marginTop: "20px" }}>
                            <div style={{ fontSize: "2em" }}><b>{import.meta.env.VITE_INSTANCE_NAME ?? "CDBFS Instance"}</b></div>
                            <div style={{ fontSize: ".9em", color: "lightGray" }}>{BACKEND_URL}</div>
                            <hr style={{ minWidth: "400px" }} />
                            <div>Serving {statistics.totalFileCount} file(s)</div>
                            <div><SizeDisplay size={statistics.totalSize ?? 0} /></div>
                        </div>
                    </>
                }
            </div>
        </CardContent>
    </Card>

}