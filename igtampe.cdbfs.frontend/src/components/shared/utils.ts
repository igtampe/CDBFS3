import CdbfsFile from "../../model/CdbfsFile";

export default function FileThumbUrl(file: CdbfsFile) {

    //Try to parse the MIME type
    const mimeSplit = file.mimeType.toLowerCase().split("/")
    if (mimeSplit.length === 1) {
        //We couldn't parse it
        return "/filetypes/file.png"
    }

    switch (mimeSplit[0]) {
        case "application":
            switch (mimeSplit[1]) {
                case "pdf":
                    return "/filetypes/application/pdf.png"
                case "msword":
                case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                    return "/filetypes/application/doc.png"
                case "vnd.ms-excel":
                case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return "/filetypes/application/xls.png"
                case "json":
                    return "/filetypes/application/json.png"
                case "xml":
                    return "/filetypes/application/xml.png"
                case "x-mspublisher":
                    return "/filetypes/application/pub.png"
                case "onenote":
                    return "/filetypes/application/one.png"
                case "vnd.ms-powerpoint":
                case "vnd.openxmlformats-officedocument.presentationml.presentation":
                    return "/filetypes/application/ppt.png"
                case "x-msdownload":
                    return "/filetypes/application/exe.png"
                case "zip":
                    return "/filetypes/application/zip.png"
                case "x-7z-compressed":
                    return "/filetypes/application/7z.png"
                case "vnd.rar":
                case "x-rar-compressed":
                    return "/filetypes/application/rar.png"
                default:
                    return "/filetypes/file.png"
            }
        case "audio":
            switch (mimeSplit[1]) {
                case "mpeg":
                    return "/filetypes/audio/mp3.png"
                case "wav":
                    return "/filetypes/audio/wav.png"
                default:
                    return "/filetypes/audio/audio.png"
            }
        case "image":
            switch (mimeSplit[1]) {
                case "jpeg":
                    return "/filetypes/image/jpg.png"
                case "png":
                    return "/filetypes/image/png.png"
                case "gif":
                    return "/filetypes/image/gif.png"
                case "bmp":
                    return "/filetypes/image/bmp.png"
                case "webp":
                    return "/filetypes/image/webp.png"
                case "svg+xml":
                case "svg":
                    return "/filetypes/image/svg.png"
                default:
                    return "/filetypes/image/image.png"
            }
        case "text":
            switch (mimeSplit[1]) {
                case "plain":
                    return "/filetypes/text/txt.png"
                case "html":
                    return "/filetypes/text/html.png"
                case "csv":
                    return "/filetypes/text/csv.png"
                default:
                    return "/filetypes/text/unknown.png"
            }
        case "video":
            switch (mimeSplit[1]) {
                case "x-msvideo":
                    return "/filetypes/video/avi.png"
                case "mp4":
                    return "/filetypes/video/mp4.png"
                case "x-matroska":
                    return "/filetypes/video/mkv.png"
                case "webm":
                    return "/filetypes/video/webm.png"
                default:
                    return "/filetypes/video/video.png"
            }
        default:
            return "/filetypes/file.png"
    }

}