using Igtampe.CDBFS.Common;

namespace Igtampe.CDBFS.Api.Utils {
    public class MimeTypeToExtensionMapper {
        private static readonly Dictionary<string, string> MimeTypeMap = new(StringComparer.InvariantCultureIgnoreCase){
            { "application/pdf", ".pdf" },
            { "application/msword", ".doc" },
            { "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx" },
            { "application/vnd.ms-excel", ".xls" },
            { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx" },
            { "application/zip", ".zip" },
            { "application/json", ".json" },
            { "application/xml", ".xml" },
            { "application/vnd.ms-powerpoint", ".ppt" },  // PowerPoint PPT
            { "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx" },  // PowerPoint PPTX
            { "image/jpeg", ".jpg" },
            { "image/png", ".png" },
            { "image/gif", ".gif" },
            { "image/bmp", ".bmp" },
            { "image/webp", ".webp" },
            { "text/plain", ".txt" },
            { "text/html", ".html" },
            { "text/csv", ".csv" },
            { "video/mp4", ".mp4" },  // MP4 video
            { "video/x-msvideo", ".avi" },  // AVI video
            { "video/x-matroska", ".mkv" },  // MKV video
            { "video/webm", ".webm" },  // WebM video
            { "audio/mpeg", ".mp3" },
            { "audio/wav", ".wav" },
            { "application/x-msdownload", ".exe" }
        };

        public static string AppendExtension(CdbfsFile file) {
            var extension = MimeTypeMap.GetValueOrDefault(file.MimeType);
            if (extension == null) { return file.Name; } //Give up if we don't know what to append
            if (file.Name.EndsWith(extension, StringComparison.InvariantCultureIgnoreCase)) {
                return file.Name; //We don't have to do anything, it already ends in the correct extension.
            }

            //Finally if we know what the extension should be, and the file doesn't have one:
            return file.Name + extension;
        }
    }
}
