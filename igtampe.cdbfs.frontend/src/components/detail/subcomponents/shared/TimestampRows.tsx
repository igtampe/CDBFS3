import Editable from "../../../../model/Editable"
import TimeAgo from 'react-timeago'

export default function TimestampRows(props: {
    item?: Editable
}) {
    const { item } = props
    if (!item) return <></>

    return <>
        <tr>
            <td>Created</td>
            <td> <TimeAgo date={item.createTs + "Z"} title={new Date(item.createTs + "Z").toLocaleString()} /></td>
        </tr>
        <tr>
            <td></td>
            <td>by {item.createUserId}</td>
        </tr>
        {item.updateTs && <>
            <tr>
                <td style={{ paddingTop: "20px" }}>Updated</td>
                <td style={{ paddingTop: "20px" }}><TimeAgo date={item.updateTs + "Z"} title={new Date(item.updateTs + "Z").toLocaleString()} /></td>
            </tr>
            <tr>
                <td></td>
                <td>by {item.updateUserId}</td>
            </tr>
        </>}
    </>
}