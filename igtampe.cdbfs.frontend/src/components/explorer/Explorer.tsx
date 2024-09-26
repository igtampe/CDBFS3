import { useEffect } from "react";
import { getDirectory } from "../../api/Folder";
import AccessRecord from "../../model/AccessRecord";
import CdbfsFile from "../../model/CdbfsFile";
import CdbfsFolder from "../../model/CdbfsFolder";
import useApi from "../hooks/useApi";
import { Button, Card, IconButton, Paper } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { CenterLoading } from "../shared/CenterLoading";
import FolderTile from "./tiles/FolderTile";
import FileTile from "./tiles/FileTile";
import { EmptyFolder } from "../shared/EmptyFolder";
import { useRefresh } from "../hooks/useRefresh";
import { DIR_REFRESH_FLAG } from "../contexts/RefreshContext";

export default function Explorer(props: {
    record?: AccessRecord,
    folder?: CdbfsFolder,
    file?: CdbfsFile,
    breadCrumbs: CdbfsFolder[]

    navTo: (val: CdbfsFolder) => void
    navUp: (levels: number) => void

    setFile: (val: CdbfsFile) => void

}) {

    const { setFile, navTo, navUp, breadCrumbs, file, folder, record } = props
    const dirApi = useApi(getDirectory);
    const { flag } = useRefresh(DIR_REFRESH_FLAG)

    useEffect(() => {
        if (record) { dirApi.fetch(undefined, undefined, record?.driveId, folder?.id) }
    }, [record, breadCrumbs, flag])


    return <Card style={{ padding: "20px", height: "100%", display: "flex", flexDirection: "column" }}>
        <BreadcrumbDisplay breadCrumbs={breadCrumbs} record={record} navUp={navUp} />
        <hr style={{ width: "100%" }} />
        <Paper style={{ overflowY: "auto", flex: "1" }} onClick={() => { setFile(undefined as any) }}>
            {dirApi.loading ? <CenterLoading />
                : dirApi.data?.folderCount === 0 && dirApi.data?.fileCount === 0
                    ? <EmptyFolder />
                    : <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: "100%", marginTop: "20px" }}>
                            {dirApi.data?.subfolders?.map((folder) => <FolderTile folder={folder} navTo={navTo} />)}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: "100%", marginTop: '20px' }}>
                            {dirApi.data?.files?.map((file) => <FileTile file={file} setFile={setFile} />)}
                        </div>
                    </>}
        </Paper>

    </Card >

}

function BreadcrumbDisplay(props: {
    record?: AccessRecord,
    breadCrumbs: CdbfsFolder[]
    navUp: (levels: number) => void
}) {

    const { breadCrumbs, navUp, record } = props

    return <div style={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "32px" }}><IconButton disabled={breadCrumbs.length === 0} onClick={() => navUp(1)} ><ArrowUpwardIcon /></IconButton></div>
        <hr style={{ height: "16px", margin: "0px 10px" }} />
        <div><Button size="small" onClick={() => navUp(breadCrumbs.length)}>{record?.drive?.name}</Button></div>
        {breadCrumbs.map((a, i) => <>
            <div style={{ margin: "0px 5px" }}>\</div>
            <div><Button size="small" onClick={() => navUp((breadCrumbs.length - (i)) - 1)}>{a.name}</Button></div>
        </>)}
        <div style={{ flex: "1" }}></div>
    </div>

}

