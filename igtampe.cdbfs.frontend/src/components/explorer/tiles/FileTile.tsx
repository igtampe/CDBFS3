import CdbfsFile from "../../../model/CdbfsFile";
import Tile from "./Tile";
import FileThumbUrl from "../../shared/utils";
import { API_PREFIX } from "../../../api/Common";

export default function FileTile(props: {
    file: CdbfsFile
    setFile: (val: CdbfsFile) => void
}) {

    const { file, setFile } = props

    const download = () => {
        window.open(API_PREFIX + `files/${file.id}/data `, "_blank")
    }

    return <Tile text={file.name} imageUrl={FileThumbUrl(file)} onClick={() => setFile(file)} onDoubleClick={download} />

}