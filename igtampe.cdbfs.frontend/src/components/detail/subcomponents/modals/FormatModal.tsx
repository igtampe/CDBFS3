import { Alert, AlertTitle, Button, CircularProgress, Dialog, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import ApiAlert from "../../../shared/ApiAlert";

export default function FormatModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void,
    driveName?: string,
    loading?: boolean,
    error?: any
    onFormat: () => void,
    onDelete: () => void
}) {

    const { onDelete, onFormat, open, setOpen, driveName, error, loading } = props;

    const [confirmName, setConfirmName] = useState("");

    useEffect(() => {
        if (open) setConfirmName("");
    }, [open])

    const buttonDisable = confirmName.toLowerCase() !== driveName?.toLowerCase();

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <div style={{ padding: "20px" }}>
            <ApiAlert result={error} style={{ marginBottom: "20px" }} />
            <div style={{ marginBottom: "20px" }}>
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    This will delete all files all the drive. All data will be permanently lost! Make sure you want to do ths!
                </Alert>
            </div>
            <TextField
                fullWidth
                label="Confirm Drive Name" variant="filled" disabled={loading} placeholder={driveName}
                value={confirmName} onChange={(e) => setConfirmName(e.target.value)}
            />

            {loading
                ? <div style={{ padding: "20px", margin: "0 auto", width: "32px" }}>
                    <CircularProgress size={32} />
                </div>
                : <>
                    <div style={{ marginTop: "20px" }}>
                        <Button color="secondary" fullWidth variant="contained" disabled={buttonDisable} onClick={onFormat}>Format Drive</Button>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <Button color="secondary" fullWidth variant="outlined" disabled={buttonDisable} onClick={onDelete}>Delete Drive</Button>
                    </div>
                </>
            }

        </div>


    </Dialog>

}