import AccessRecord from "../../model/AccessRecord";
import CdbfsFile from "../../model/CdbfsFile";
import CdbfsFolder from "../../model/CdbfsFolder";
import DriveDetailPane from "./subcomponents/DriveDetailPane";
import FileDetailPane from "./subcomponents/FileDetailPane";
import FolderDetailPane from "./subcomponents/FolderDetailPane";

export default function DetailPane(props: {
    record?: AccessRecord
    folder?: CdbfsFolder
    file?: CdbfsFile
}) {

    const { record, file, folder } = props;
    if (!record && !file && !folder) return <></>

    if (file) {
        return <FileDetailPane file={file} />
    }

    if (folder) {
        return <FolderDetailPane folder={folder} />
    }

    if (record) {
        return <DriveDetailPane record={record} />
    }


}