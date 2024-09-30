import { Card, CardActionArea, Typography } from "@mui/material";

export default function Tile(props: {
    text: string,
    imageUrl?: string,
    onClick?: () => void
    onDoubleClick?: () => void
    onContextMenu?: () => void
}) {

    const { imageUrl, onClick, onContextMenu, onDoubleClick, text } = props

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (onClick) onClick();

    }

    const handleDoubleClick = (e: any) => {
        e.stopPropagation();
        if (onDoubleClick) onDoubleClick();
        return false;

    }

    const handleContextMenu = (e: any) => {
        e.stopPropagation();
        if (onContextMenu) onContextMenu();
        return false;

    }

    return <Card style={{ width: "250px", margin: "5px" }} elevation={4}>
        <CardActionArea style={{ padding: "10px" }} onClick={handleClick} onDoubleClick={handleDoubleClick} onContextMenu={handleContextMenu}>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", maxWidth: "230px" }}>
                {imageUrl && <div style={{ marginRight: "20px", width: "32px" }}> <img src={imageUrl} height={32} /></div>}
                <div style={{ width: "170px" }}><Typography noWrap>{text}</Typography></div>
            </div>
        </CardActionArea>
    </Card>

}