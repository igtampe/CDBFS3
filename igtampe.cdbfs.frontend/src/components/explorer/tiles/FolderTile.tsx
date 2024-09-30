import CdbfsFolder from "../../../model/CdbfsFolder";
import Tile from "./Tile";

export default function FolderTile(props: {
    folder: CdbfsFolder
    navTo: (val: CdbfsFolder) => void
}) {

    const { folder, navTo } = props

    return <Tile text={folder.name} imageUrl="/filetypes/folder.png" onDoubleClick={() => navTo(folder)} />

}