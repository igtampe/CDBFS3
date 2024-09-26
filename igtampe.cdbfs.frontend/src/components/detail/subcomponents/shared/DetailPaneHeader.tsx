export default function DetailPaneHeader(props: {
    imageUrl: string,
    name: string
}) {

    const { imageUrl, name } = props;

    return <>
        <img src={imageUrl} style={{ maxWidth: "128px", margin: "0 auto", height: "auto" }} />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <b>{name}</b>
        </div>
        <hr style={{ width: "100%" }} />
    </>

}