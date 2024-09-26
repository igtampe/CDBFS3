import CdbfsFolder from "../../../model/CdbfsFolder";
import SizeDisplay from "../../shared/SizeDisplay";
import DetailPaneHeader from "./shared/DetailPaneHeader";
import TimestampRows from "./shared/TimestampRows";

export default function FolderDetailPane(props: {
    folder: CdbfsFolder
}) {

    const { folder } = props;

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


    </div>
}