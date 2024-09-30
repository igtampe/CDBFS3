import { useEffect, useState } from "react";
import { addAccess, driveAccess, removeAccess, updateAccess } from "../../../../api/Access";
import CdbfsDrive from "../../../../model/CdbfsDrive";
import useApi from "../../../hooks/useApi";
import AccessRecord, { AccessLevel } from "../../../../model/AccessRecord";
import { Avatar, Button, CircularProgress, Dialog, DialogActions, IconButton, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import ApiAlert from "../../../shared/ApiAlert";
import { useTheme } from "@emotion/react";
import { useUser } from "../../../hooks/useUser";
import { Check } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function AccessManagementModal(props: {
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