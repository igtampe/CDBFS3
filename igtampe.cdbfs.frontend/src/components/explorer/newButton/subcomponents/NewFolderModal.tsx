import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { Button, CircularProgress, Dialog, DialogContent, TextField } from "@mui/material";
import ApiAlert from "../../../shared/ApiAlert";
import { DIR_REFRESH_FLAG } from "../../../contexts/RefreshContext";
import { useRefresh } from "../../../hooks/useRefresh";
import CdbfsFolder from "../../../../model/CdbfsFolder";
import CdbfsDrive from "../../../../model/CdbfsDrive";
import { createFolder } from "../../../../api/Folder";
import FolderRequest from "../../../../model/requests/FolderRequest";

export function NewFolderModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    folder?: CdbfsFolder,
    drive?: CdbfsDrive
}) {

    const { open, setOpen, drive, folder } = props
    const newFolderApi = useApi(createFolder);

    const [name, setName] = useState("")
    const { refresh: refreshDrives } = useRefresh(DIR_REFRESH_FLAG)

    useEffect(() => {
        setName("")
    }, [open])

    const handleClick = () => {
        newFolderApi.fetch(onSuccess, undefined, {
            name: name,
            drive: drive?.id,
            parentFolder: folder?.id
        } as FolderRequest)
    }

    const onSuccess = () => {
        setOpen(false);
        refreshDrives();
    }



    return <Dialog open={open} maxWidth={"xs"} fullWidth onClose={() => setOpen(false)}>
        <DialogContent>
            <ApiAlert result={newFolderApi.error} style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex" }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="filetypes/folder.png" width={64} />
                </div>
                <hr style={{ margin: "0 20px" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div>
                        <TextField
                            fullWidth placeholder="New Folder Name" variant="standard"
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: "1", display: "flex", flexDirection: "row-reverse", marginTop: "20px" }}>
                        {(newFolderApi.loading)
                            ? <CircularProgress size={25} />
                            : <Button onClick={handleClick}>Create</Button>
                        }
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}
