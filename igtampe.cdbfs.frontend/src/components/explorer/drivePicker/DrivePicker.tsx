import { useEffect } from "react";
import { myAccess } from "../../../api/Access"
import useApi from "../../hooks/useApi"
import { useUser } from "../../hooks/useUser";
import { CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AccessRecord from "../../../model/AccessRecord";
import CdbfsDrive from "../../../model/CdbfsDrive";
import { DRIVE_REFRESH_FLAG } from "../../contexts/RefreshContext";
import { useRefresh } from "../../hooks/useRefresh";

export default function DrivePicker(props: {
    drive?: CdbfsDrive,
    setRecord: (val: AccessRecord) => void
}) {

    const { drive, setRecord } = props

    const user = useUser();
    const { flag } = useRefresh(DRIVE_REFRESH_FLAG)

    const drivesApi = useApi(myAccess)

    useEffect(() => {
        drivesApi.fetch(refreshSelectedDrive);
    }, [user.user, flag]);

    const refreshSelectedDrive = (vals?: AccessRecord[]) => {
        if (!drive) return;
        const record = vals?.filter(a => a.driveId === drive.id)
        if (!record || record.length === 0) {
            setRecord(undefined as any);
        } else {
            setRecord(record[0]);
        }
    }

    if (drivesApi.loading) {
        return <div style={{ width: "32px", margin: "0 auto", marginTop: "20px" }}>
            <CircularProgress size={32} />
        </div>
    }

    if (drivesApi.data && drivesApi.data.length === 0) {
        return <div style={{ textAlign: "center", marginTop: "20px" }}>No Drives!</div>
    }

    return <List component="nav">
        {drivesApi.data?.map(a => <ListItemButton
            key={`access${a.id}`}
            selected={a.driveId == drive?.id}
            onClick={() => {
                if (a.driveId !== drive?.id) { setRecord(a) }
                else {
                    setRecord(undefined as any)
                }
            }}
        >
            <ListItemIcon>
                <img src="/filetypes/drive.png" height={32} />
            </ListItemIcon>
            <ListItemText primary={a.drive?.name} />
        </ListItemButton>)
        }
    </List>

}