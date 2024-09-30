import { Button } from "@mui/material";
import AccessRecord from "../../../model/AccessRecord";
import CdbfsFolder from "../../../model/CdbfsFolder";
import SizeDisplay from "../../shared/SizeDisplay";
import DetailPaneHeader from "./shared/DetailPaneHeader";
import TimestampRows from "./shared/TimestampRows";
import { useState } from "react";
import { deleteFolder, updateFolder } from "../../../api/Folder";
import useApi from "../../hooks/useApi";
import FolderRequest from "../../../model/requests/FolderRequest";
import RenameModal from "../../shared/modals/RenameModal";
import AreYouSureModal from "../../shared/modals/AreYouSureModal";

export default function FolderDetailPane(props: {
    record: AccessRecord
    folder: CdbfsFolder
    setFolder: (val: CdbfsFolder) => void;
    navUp: () => void
}) {

    const { folder, record, navUp, setFolder } = props;

    const [renameModalOpen, setRenameModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const renameApi = useApi(updateFolder);
    const deleteApi = useApi(deleteFolder);

    const rename = (val: string) => {
        renameApi.fetch(() => { onRenameSuccess(val) }, undefined, {
            id: folder.id,
            name: val
        } as FolderRequest)
    }

    const executeDelete = () => {
        deleteApi.fetch(onDeleteSuccess, undefined, {
            id: folder.id
        } as FolderRequest)
    }

    const onRenameSuccess = (val: string) => {
        setRenameModalOpen(false)
        setFolder({ ...folder, name: val } as CdbfsFolder)
    }

    const onDeleteSuccess = () => {
        setRenameModalOpen(false)
        navUp();
    }


    return <div style={{ height: "100%", display: "flex", overflowY: "auto", flexDirection: "column", padding: "20px" }}>

        <DetailPaneHeader imageUrl="/filetypes/folder.png" name={folder.name ?? ""} />

        <table>
            <thead><tr><td></td><td></td></tr></thead>
            <tbody>
                <TimestampRows item={folder} />
                <tr >
                    <td style={{ paddingTop: "20px" }}>Size</td>
                    <td style={{ paddingTop: "20px" }}><SizeDisplay size={folder?.size ?? 0} /></td>
                </tr>
                <tr>
                    <td></td>
                    <td>{folder?.folderCount} Folder(s)</td>
                </tr>
                <tr>
                    <td></td>
                    <td>{folder?.fileCount} File(s)</td>
                </tr>
            </tbody>
        </table>

        {record.access > 1 && <>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <hr style={{ width: "100%" }} />
                <div style={{ marginBottom: "20px" }}><Button fullWidth onClick={() => setRenameModalOpen(true)}>Rename Folder</Button></div>
                <div style={{ flex: "1" }}></div>
                <div style={{ marginBottom: "20px" }}><Button color="secondary" variant="contained" fullWidth onClick={() => setDeleteModalOpen(true)}>Delete Folder</Button></div>
            </div>

            <RenameModal
                itemType="folder" open={renameModalOpen} setOpen={setRenameModalOpen}
                defaultValue={folder.name} loading={renameApi.loading}
                onOk={rename} renameError={renameApi.error}
            />

            <AreYouSureModal open={deleteModalOpen} setOpen={setDeleteModalOpen}
                onYes={executeDelete} loading={deleteApi.loading} error={deleteApi.error}
            >
                <div>Are you sure you want to delete this folder?</div>
            </AreYouSureModal>

        </>}


    </div>
}