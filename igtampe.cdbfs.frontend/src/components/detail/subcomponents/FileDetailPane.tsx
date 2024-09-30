import { useState } from "react";
import AccessRecord from "../../../model/AccessRecord";
import CdbfsFile from "../../../model/CdbfsFile";
import RenameModal from "../../shared/modals/RenameModal";
import SizeDisplay from "../../shared/SizeDisplay";
import FileThumbUrl from "../../shared/utils";
import DetailPaneHeader from "./shared/DetailPaneHeader";
import TimestampRows from "./shared/TimestampRows";
import useApi from "../../hooks/useApi";
import { deleteFile, renameFile } from "../../../api/FIle";
import FileRequest from "../../../model/requests/FileRequest";
import FileRenameRequest from "../../../model/requests/FileRenameRequest";
import { useRefresh } from "../../hooks/useRefresh";
import { DIR_REFRESH_FLAG } from "../../contexts/RefreshContext";
import AreYouSureModal from "../../shared/modals/AreYouSureModal";
import { Button } from "@mui/material";

export default function FileDetailPane(props: {
    record: AccessRecord,
    file: CdbfsFile
    setFile: (val: CdbfsFile) => void
}) {

    const { file, record, setFile } = props;

    const { refresh } = useRefresh(DIR_REFRESH_FLAG)

    const [renameModalOpen, setRenameModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const renameApi = useApi(renameFile);
    const deleteApi = useApi(deleteFile);

    const rename = (val: string) => {
        renameApi.fetch(() => { onRenameSuccess(val) }, undefined, {
            id: file.id,
            name: val
        } as FileRenameRequest)
    }

    const executeDelete = () => {
        deleteApi.fetch(onDeleteSuccess, undefined, {
            id: file.id
        } as FileRequest)
    }

    const onRenameSuccess = (val: string) => {
        setRenameModalOpen(false)
        setFile({ ...file, name: val } as CdbfsFile)
        refresh();
    }

    const onDeleteSuccess = () => {
        setDeleteModalOpen(false)
        setFile(undefined as any)
        refresh();
    }


    return <div style={{ height: "100%", display: "flex", overflowY: "auto", flexDirection: "column", padding: "20px" }}>

        <DetailPaneHeader imageUrl={FileThumbUrl(file)} name={file.name ?? ""} />

        <table>
            <thead><tr><td></td><td></td></tr></thead>
            <tbody>
                <TimestampRows item={file} />
                <tr >
                    <td style={{ paddingTop: "20px" }}>Size</td>
                    <td style={{ paddingTop: "20px" }}><SizeDisplay size={file?.size ?? 0} /></td>
                </tr>
            </tbody>
        </table>

        {record.access > 1 && <>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <hr style={{ width: "100%" }} />
                <div style={{ marginBottom: "20px" }}><Button fullWidth onClick={() => setRenameModalOpen(true)}>Rename File</Button></div>
                <div style={{ flex: "1" }}></div>
                <div style={{ marginBottom: "20px" }}><Button color="secondary" variant="contained" fullWidth onClick={() => setDeleteModalOpen(true)}>Delete File</Button></div>
            </div>

            <RenameModal
                itemType="file" open={renameModalOpen} setOpen={setRenameModalOpen}
                defaultValue={file.name} loading={renameApi.loading}
                onOk={rename} renameError={renameApi.error}
            />

            <AreYouSureModal open={deleteModalOpen} setOpen={setDeleteModalOpen}
                onYes={executeDelete} loading={deleteApi.loading} error={deleteApi.error}
            >
                <div>Are you sure you want to delete this file?</div>
            </AreYouSureModal>

        </>}


    </div>
}