import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { Button, CircularProgress, Dialog, DialogContent, TextField } from "@mui/material";
import ApiAlert from "../../../shared/ApiAlert";
import { createDrive } from "../../../../api/Drive";
import DriveRequest from "../../../../model/requests/DriveRequest";
import { DRIVE_REFRESH_FLAG } from "../../../contexts/RefreshContext";
import { useRefresh } from "../../../hooks/useRefresh";
import { useSnackbar } from "notistack";

export function NewDriveModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props
    const { enqueueSnackbar } = useSnackbar();
    const newDriveApi = useApi(createDrive);

    const [name, setName] = useState("")
    const { refresh: refreshDrives } = useRefresh(DRIVE_REFRESH_FLAG)

    useEffect(() => {
        setName("")
    }, [open])

    const handleClick = () => {
        newDriveApi.fetch(onSuccess, undefined, { name: name } as DriveRequest)
    }

    const onSuccess = () => {
        setOpen(false);
        enqueueSnackbar("Drive created!", { variant: "success" })
        refreshDrives();
    }



    return <Dialog open={open} maxWidth={"xs"} fullWidth onClose={() => setOpen(false)}>
        <DialogContent>
            <ApiAlert result={newDriveApi.error} style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex" }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="filetypes/drive.png" width={64} />
                </div>
                <hr style={{ margin: "0 20px" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div>
                        <TextField
                            fullWidth placeholder="New Drive Name" variant="standard"
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: "1", display: "flex", flexDirection: "row-reverse", marginTop: "20px" }}>
                        {(newDriveApi.loading)
                            ? <CircularProgress size={25} />
                            : <Button onClick={handleClick}>Create</Button>
                        }
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}
