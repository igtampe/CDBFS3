import { Avatar, Button, CircularProgress, Dialog, DialogActions, IconButton, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import CdbfsDrive from "../../../model/CdbfsDrive";
import { useUser } from "../../hooks/useUser";
import SizeDisplay from "../../shared/SizeDisplay";
import DetailPaneHeader from "./shared/DetailPaneHeader";
import TimestampRows from "./shared/TimestampRows";
import { addAccess, driveAccess, removeAccess, updateAccess } from "../../../api/Access";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AccessRecord, { AccessLevel } from "../../../model/AccessRecord";
import { useTheme } from "@emotion/react";
import ApiAlert from "../../shared/ApiAlert";
import { Check } from "@mui/icons-material";

export default function DriveDetailPane(props: {
    record: AccessRecord
}) {

    const { record } = props;

    const [accessModalOpen, setAccessModalOpen] = useState(false)

    return <div style={{ height: "100%", display: "flex", overflowY: "auto", flexDirection: "column", padding: "20px" }}>

        <DetailPaneHeader imageUrl="/filetypes/drive.png" name={record.drive?.name ?? ""} />

        <table>
            <thead><tr><td></td><td></td></tr></thead>
            <tbody>
                <TimestampRows item={record.drive} />
                <tr >
                    <td style={{ paddingTop: "20px" }}>Size</td>
                    <td style={{ paddingTop: "20px" }}><SizeDisplay size={record.drive?.size ?? 0} /></td>
                </tr>
                <tr>
                    <td></td>
                    <td>{record.drive?.folderCount} Folder(s)</td>
                </tr>
                <tr>
                    <td></td>
                    <td>{record.drive?.fileCount} File(s)</td>
                </tr>
            </tbody>
        </table>

        {record.access > 1 && <>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <hr style={{ width: "100%" }} />
                <div style={{ marginBottom: "5px" }}><Button fullWidth onClick={() => setAccessModalOpen(true)}>Manage Access</Button></div>
                <div style={{ marginBottom: "20px" }}><Button fullWidth onClick={() => setAccessModalOpen(true)}>Rename Drive</Button></div>
                <div style={{ flex: "1" }}></div>
                <div style={{ marginBottom: "20px" }}><Button color="secondary" variant="contained" fullWidth onClick={() => setAccessModalOpen(true)}>Format Drive</Button></div>
            </div>

            <AccessManagementModal open={accessModalOpen} setOpen={setAccessModalOpen} drive={record.drive} />
        </>}


    </div>
}

function AccessManagementModal(props: {
    open: boolean
    setOpen: (val: boolean) => void
    drive?: CdbfsDrive
}) {

    const { open, setOpen, drive } = props;

    const access = useApi(driveAccess);
    const deleteAccessApi = useApi(removeAccess)
    const updateAccessApi = useApi(updateAccess)
    const addAccessApi = useApi(addAccess)

    const [add, setAdd] = useState(false)
    const [newRecord, setNewRecord] = useState({} as AccessRecord)

    const anyLoading = access.loading || deleteAccessApi.loading || updateAccessApi.loading || addAccessApi.loading


    const refresh = () => {
        access.fetch(undefined, undefined, drive?.id)
        deleteAccessApi.resetError()
        updateAccessApi.resetError();
        addAccessApi.resetError();
        setAdd(false)
        setNewRecord({
            username: "",
            driveId: drive?.id,
            access: AccessLevel.READ
        } as AccessRecord)
    }

    useEffect(refresh, [open])


    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <div style={{ minHeight: "200px", maxHeight: "500px", overflowY: "auto", padding: "20px" }}>
            <ApiAlert result={access.error} />
            <ApiAlert result={deleteAccessApi.error} />
            <ApiAlert result={updateAccessApi.error} />
            <ApiAlert result={addAccessApi.error} />
            {anyLoading ? <div style={{ width: "32px", margin: "64px auto" }}><CircularProgress size={32} /></div>
                : <>
                    <List>
                        {access.data?.map(record => <AccessManagementRow
                            record={record}
                            deleteSelf={() => { deleteAccessApi.fetch(refresh, undefined, record) }}
                            update={(val: number) => updateAccessApi.fetch(refresh, undefined, { ...record, access: val })}
                        />)}
                        {add && <AddAccessManagementRow record={newRecord} setRecord={setNewRecord} add={() => addAccessApi.fetch(refresh, undefined, newRecord)} />}

                    </List>
                </>}
        </div>

        <DialogActions>
            {access.data?.filter(a => a.username === null).length === 0 && !add && <Button onClick={() => {
                addAccessApi.fetch(refresh, undefined, { ...newRecord, username: null })
            }}>Allow Public Access</Button>}
            <Button disabled={anyLoading} onClick={() => setAdd(!add)}>{add ? "Cancel" : "Add Access"}</Button>
        </DialogActions>

    </Dialog>
}

function AddAccessManagementRow(props: {
    record: AccessRecord,
    setRecord: (val: AccessRecord) => void,
    add: () => void
}) {
    const { record, setRecord, add } = props;
    const theme = useTheme() as any;


    return <ListItem secondaryAction={<div style={{ maxWidth: "200px", display: "flex", alignItems: 'center' }}>
        <div style={{ width: "100px", marginRight: "20px" }}>
            <Select value={record.access} variant="standard" fullWidth onChange={(e) => { setRecord({ ...record, access: e.target.value as AccessLevel }) }}>
                <MenuItem value={0}>Reader</MenuItem>
                <MenuItem value={1}>Writer</MenuItem>
                <MenuItem value={2}>Owner</MenuItem>
            </Select>
        </div>
        <IconButton edge="end" aria-label="delete" disabled={record.username.length === 0} onClick={add}><Check /></IconButton>
    </div>} >
        <ListItemAvatar>
            <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: !record.username ? "#AAAA" : theme.palette.primary.main }}>{record.username?.charAt(0) ?? "?"}</Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={<div style={{ maxWidth: "200px" }}>
                <TextField
                    fullWidth placeholder="Username" variant="standard"
                    value={record.username} onChange={(e) => setRecord({ ...record, username: e.target.value })}
                />
            </div>}
        />
    </ListItem>
}

function AccessManagementRow(props: {
    record: AccessRecord
    deleteSelf: () => void
    update: (val: number) => void
}) {

    const { record, deleteSelf, update } = props;
    const { user } = useUser();
    const theme = useTheme() as any;


    return <ListItem secondaryAction={<div style={{ maxWidth: "200px", display: "flex", alignItems: 'center' }}>
        <div style={{ width: "100px", marginRight: "20px" }}>
            <Select value={record.access} variant="standard" fullWidth disabled={user?.username === record.username || !record.username} onChange={(e) => { update(e.target.value as number) }}>
                <MenuItem value={0}>Reader</MenuItem>
                <MenuItem value={1}>Writer</MenuItem>
                <MenuItem value={2}>Owner</MenuItem>
            </Select>
        </div>
        <IconButton edge="end" aria-label="delete" disabled={user?.username === record.username} onClick={deleteSelf}><DeleteIcon /></IconButton>
    </div>} >
        <ListItemAvatar>
            <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: !record.username ? "#AAAA" : theme.palette.primary.main }}>{record.username?.charAt(0) ?? "?"}</Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={record.username ?? "Public Access"}
        />
    </ListItem>

}