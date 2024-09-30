import { Card, CardContent, Typography } from "@mui/material";

const ChopoBarBackground = `linear-gradient(to right, 
    #57007F 0%, #57007F 16.67%, 
    #7F006E 16.67%, #7F006E 33.34%, 
    #FF006E 33.34%, #FF006E 50.01%, 
    #FF0000 50.01%, #FF0000 66.68%, 
    #FF6A00 66.68%, #FF6A00 83.35%, 
    #FFD800 83.35%, #FFD800 100%)`

export default function HomePane() {

    return <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ background: ChopoBarBackground }}>
            <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,.2)", padding: "20px 20px" }}>
                <Typography fontSize={"1.5em"}><b>Welcome to CDBFS</b></Typography>
            </div>
        </div>
        <CardContent style={{ flex: "1", overflowY: "auto" }}>
            <div style={{ padding: "0px 20px" }}>
                <p>
                    The Chopo Database Filesystem is your own personal cloud system. Whether you host it on your own bare
                    metal, or host it on another provider, you alone control your files. Once you've uploaded them, you
                    can easily share them with a static link.
                </p>
                <p>
                    I have no idea what else to put here
                </p>

            </div>
        </CardContent>
    </Card>

}