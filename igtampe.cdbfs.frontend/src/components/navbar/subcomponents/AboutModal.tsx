import { Dialog } from "@mui/material"

export default function AboutModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void,
}) {

    const { open, setOpen } = props;

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <div style={{ padding: "20px", width: "100%" }}>
            <div style={{ width: "75%", margin: "0 auto", textAlign: "center" }}>
                <img src="/header.png" style={{ width: "100%" }} />
                The Chopo Database File System
            </div>
            <hr />
            <div style={{ textAlign: "center" }}>
                Version 1.0
                <div style={{ fontSize: ".8em" }}>
                    (C)2024 Igtampe, No Rights Reserved
                </div>
            </div>

        </div>
    </Dialog>

}