import { Button } from "@mui/material";
import SizeDisplay from "../../shared/SizeDisplay";
import DetailPaneHeader from "./shared/DetailPaneHeader";
import TimestampRows from "./shared/TimestampRows";
import { useState } from "react";
import AccessRecord from "../../../model/AccessRecord";
import AccessManagementModal from "./modals/AccessManagementModal";
import RenameModal from "../../shared/modals/RenameModal";
import useApi from "../../hooks/useApi";
import { deleteDrive, formatDrive, updateDrive } from "../../../api/Drive";
import { useRefresh } from "../../hooks/useRefresh";
import { DIR_REFRESH_FLAG, DRIVE_REFRESH_FLAG } from "../../contexts/RefreshContext";
import DriveRequest from "../../../model/requests/DriveRequest";
import FormatModal from "./modals/FormatModal";
import { useSnackbar } from "notistack";

export default function DriveDetailPane(props: {
    record: AccessRecord
}) {

    const { record } = props;
    const { refresh: refreshDrives } = useRefresh(DRIVE_REFRESH_FLAG);
    const { refresh: refreshDir } = useRefresh(DIR_REFRESH_FLAG)

    const { enqueueSnackbar } = useSnackbar();

    const renameApi = useApi(updateDrive);
    const formatApi = useApi(formatDrive)
    const deleteApi = useApi(deleteDrive);

    const [accessModalOpen, setAccessModalOpen] = useState(false)
    const [renameModalOpen, setRenameModalOpen] = useState(false)
    const [formatModalOpen, setFormatModalOpen] = useState(false)

    const rename = (val: string) => {
        renameApi.fetch(onRenameSuccess, undefined, {
            Id: record.driveId,
            name: val
        } as DriveRequest)
    }

    const executeFormat = () => {
        formatApi.fetch(onFormatSuccess, undefined, { Id: record.driveId } as DriveRequest)
    }

    const executeDelete = () => {
        deleteApi.fetch(onDeleteSuccess, undefined, { Id: record.driveId } as DriveRequest)
    }

    const onFormatSuccess = () => {
        enqueueSnackbar("Drive formatted!", { variant: "success" })
        setFormatModalOpen(false);
        refreshDrives();
        refreshDir();
    }

    const onDeleteSuccess = () => {
        enqueueSnackbar("Drive deleted!", { variant: "success" })
        setFormatModalOpen(false);
        refreshDrives();
    }

    const onRenameSuccess = () => {
        enqueueSnackbar("Drive renamed!", { variant: "success" })
        setRenameModalOpen(false)
        refreshDrives();
    }

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
                <div style={{ marginBottom: "20px" }}><Button fullWidth onClick={() => setRenameModalOpen(true)}>Rename Drive</Button></div>
                <div style={{ flex: "1" }}></div>
                <div style={{ marginBottom: "20px" }}><Button color="secondary" variant="contained" fullWidth onClick={() => setFormatModalOpen(true)}>Format Drive</Button></div>
            </div>

            <AccessManagementModal open={accessModalOpen} setOpen={setAccessModalOpen} drive={record.drive} />
            <RenameModal
                itemType="drive" open={renameModalOpen} setOpen={setRenameModalOpen}
                defaultValue={record.drive?.name ?? ""} loading={renameApi.loading}
                onOk={rename} renameError={renameApi.error}
            />
            <FormatModal
                onDelete={executeDelete} onFormat={executeFormat} open={formatModalOpen} setOpen={setFormatModalOpen}
                driveName={record.drive?.name} error={formatApi.error ?? deleteApi.error} loading={formatApi.loading || deleteApi.loading}
            />

        </>}


    </div>
}
