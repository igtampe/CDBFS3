using Igtampe.CDBFS.Common;

namespace Igtampe.CDBFS.Api.Utils {
    public class MimeTypeToExtensionMapper {
        private static readonly Dictionary<string, string> MimeTypeMap = new(StringComparer.InvariantCultureIgnoreCase){

            //Applications - UnknownFile
            { "application/pdf", ".pdf" }, //PDF
            
            { "application/msword", ".doc" }, //Word
            { "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx" }, //Word
            
            { "application/vnd.ms-excel", ".xls" }, //Excel
            { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx" }, //Excel
            
            { "application/json", ".json" }, //JSON
            { "application/xml", ".xml" }, //XML

            { "application/x-mspublisher", ".pub"}, //Publisher
            
            { "application/onenote",".one"}, //OneNote

            { "application/vnd.ms-powerpoint", ".ppt" }, //Powerpoint
            { "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx" }, //Powerpoint
            
            { "application/x-msdownload", ".exe" }, //EXE

            { "application/zip", ".zip" },//zip
            { "application/x-7z-compressed", ".7z"}, //7z
            { "application/vnd.rar", ".rar"}, //7z
            { "application/x-rar-compressed",".rar"},

            //Image - UnknownImage
            { "image/jpeg", ".jpg" }, //jpg
            { "image/png", ".png" }, //png
            { "image/gif", ".gif" }, //gif
            { "image/bmp", ".bmp" }, //bmp
            { "image/webp", ".webp" }, //webp
            { "image/svg+xml", ".svg"}, //svg
            { "image/svg", ".svg"}, //svg
            
            //Text - UnknownText
            { "text/plain", ".txt" }, //Text
            { "text/html", ".html" }, //HTML
            { "text/csv", ".csv" }, //CSV
            
            //Video
            { "video/mp4", ".mp4" }, //MP4
            { "video/x-msvideo", ".avi" },  //Avi
            { "video/x-matroska", ".mkv" }, //MKV 
            { "video/webm", ".webm" },  //Webm

            //Audio - UnknownAudio
            { "audio/mpeg", ".mp3" }, //MP3
            { "audio/wav", ".wav" } //WAV
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
