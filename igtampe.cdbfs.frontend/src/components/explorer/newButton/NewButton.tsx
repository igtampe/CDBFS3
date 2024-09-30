import { Button, Divider, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRef, useState } from "react";
import { AddBox, CreateNewFolder/*, DriveFolderUpload*/, UploadFile } from "@mui/icons-material";
import AccessRecord from "../../../model/AccessRecord";
import CdbfsFolder from "../../../model/CdbfsFolder";
import { NewDriveModal } from "./subcomponents/NewDriveModal";
import { useRefresh } from "../../hooks/useRefresh";
import { DIR_REFRESH_FLAG } from "../../contexts/RefreshContext";
import { NewFolderModal } from "./subcomponents/NewFolderModal";
import useUpload from "../../hooks/useUpload";
import { createFile } from "../../../api/FIle";
import FileRequest from "../../../model/requests/FileRequest";
import ApiAlert from "../../shared/ApiAlert";

export default function NewButton(props: {
    record: AccessRecord,
    folder?: CdbfsFolder,
}) {

    const fileInputRef = useRef(null as any);

    const { record, folder } = props;

    const [menuEl, setMenuEl] = useState(false as any);
    const [newDriveOpen, setNewDriveOpen] = useState(false)
    const [newFolderOpen, setNewFolderOpen] = useState(false)

    const handleNewClick = (e: React.MouseEvent<HTMLButtonElement>) => { setMenuEl(e.currentTarget); };

    const { refresh: refreshDir } = useRefresh(DIR_REFRESH_FLAG)
    const createFileApi = useUpload(createFile)

    const handleNewDriveClick = () => {
        closeMenu();
        setNewDriveOpen(true)
    }

    const handleCreateFolderClick = () => {
        setNewFolderOpen(true)
        closeMenu();
    }

    // const handleFolderUploadClick = () => {
    //     refreshDir()
    //     closeMenu();
    // }

    const handleFileUploadClick = () => {
        fileInputRef?.current?.click();
        closeMenu()
    }

    // Function to handle file selection
    const handleFileSelect = (event: any) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            createFileApi.fetch(refreshDir, undefined, {
                drive: record?.drive?.id,
                folder: folder?.id ?? -1
            } as FileRequest, file)
        }
    };


    const closeMenu = () => { setMenuEl(undefined) }

    return <>

        {
            createFileApi.loading
                ? <>
                    <div style={{ margin: "10px 0px" }}>Uploading...</div>
                    <LinearProgress value={createFileApi.progress} variant={createFileApi.progress === 0 || createFileApi.progress === 100 ? "indeterminate" : "determinate"} />
                </>
                : <>
                    <Button variant="contained" fullWidth startIcon={<AddCircleOutlineIcon />} onClick={handleNewClick} >
                        New
                    </Button>
                    <ApiAlert result={createFileApi.error} />
                </>

        }

        <Menu anchorEl={menuEl} open={!!menuEl} onClose={closeMenu}>
            <MenuItem onClick={handleNewDriveClick}>
                <ListItemIcon><AddBox fontSize="small" /></ListItemIcon>
                <ListItemText>Create Drive</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCreateFolderClick} disabled={(record?.access ?? 0) === 0}>
                <ListItemIcon><CreateNewFolder fontSize="small" /></ListItemIcon>
                <ListItemText>Create Folder</ListItemText>
            </MenuItem>
            <Divider />
            {/* <MenuItem onClick={handleFolderUploadClick} disabled={(record?.access ?? 0) === 0}>
                <ListItemIcon><DriveFolderUpload fontSize="small" /></ListItemIcon>
                <ListItemText>Upload Folder</ListItemText>
            </MenuItem> */}
            <MenuItem onClick={handleFileUploadClick} disabled={(record?.access ?? 0) === 0}>
                <ListItemIcon><UploadFile fontSize="small" /></ListItemIcon>
                <ListItemText>Upload File</ListItemText>
            </MenuItem>
        </Menu>

        <NewDriveModal open={newDriveOpen} setOpen={setNewDriveOpen} />
        <NewFolderModal open={newFolderOpen} setOpen={setNewFolderOpen} drive={record?.drive} folder={folder} />


        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
        />

    </>

}