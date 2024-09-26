import CdbfsFile from "../../../model/CdbfsFile";
import SizeDisplay from "../../shared/SizeDisplay";
import FileThumbUrl from "../../shared/utils";
import DetailPaneHeader from "./shared/DetailPaneHeader";
import TimestampRows from "./shared/TimestampRows";

export default function FileDetailPane(props: {
    file: CdbfsFile
}) {

    const { file } = props;

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


    </div>
}