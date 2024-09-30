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
    setFolder: (val: CdbfsFolder) => void,
    setFile: (val: CdbfsFile) => void,
    navUp: () => void
}) {

    const { record, file, folder, navUp, setFile, setFolder } = props;
    if (!record && !file && !folder) return <></>

    if (file && record) {
        return <FileDetailPane file={file} setFile={setFile} record={record} />
    }

    if (folder && record) {
        return <FolderDetailPane record={record} folder={folder} navUp={navUp} setFolder={setFolder} />
    }

    if (record) {
        return <DriveDetailPane record={record} />
    }


}