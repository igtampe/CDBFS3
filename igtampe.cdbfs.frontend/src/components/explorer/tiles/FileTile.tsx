import CdbfsFile from "../../../model/CdbfsFile";
import Tile from "./Tile";
import FileThumbUrl from "../../shared/utils";

export default function FileTile(props: {
    file: CdbfsFile
    setFile: (val: CdbfsFile) => void
}) {

    const { file, setFile } = props

    return <Tile text={file.name} imageUrl={FileThumbUrl(file)} onClick={() => setFile(file)} />

}