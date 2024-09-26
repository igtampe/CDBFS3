export default function SizeDisplay(props: {
    size: number
}) {

    const KB_SIZE = 1024
    const MB_SIZE = 1048576
    const GB_SIZE = 1073741824
    const TB_SIZE = 1099511627776

    const { size } = props

    if (size < 1024) { return <>{size} Bytes</> }
    if (size > KB_SIZE && size < MB_SIZE) { return <>{(size / KB_SIZE).toFixed(2)} KBs</> }
    if (size > MB_SIZE && size < GB_SIZE) { return <>{(size / MB_SIZE).toFixed(2)} MBs</> }
    if (size > GB_SIZE && size < TB_SIZE) { return <>{(size / GB_SIZE).toFixed(2)} GBs</> }
    if (size > TB_SIZE) { return <>{(size / TB_SIZE).toFixed(2)} TBs</> }
    return <></>

}