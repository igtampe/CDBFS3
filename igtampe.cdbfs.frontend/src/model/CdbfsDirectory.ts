import CdbfsDrive from "./CdbfsDrive";
import CdbfsFile from "./CdbfsFile";
import CdbfsFolder from "./CdbfsFolder";

export default class CdbfsDirectory{
    public constructor(
        public drive : CdbfsDrive,
        public folder : CdbfsFolder,
        public subfolders : CdbfsFolder[],
        public files : CdbfsFile[],
        public fileCount:number,
        public folderCount:number,
        public fileSize:number,
        public foldersSize: number,
        public folderSize:number,
        public driveSize:number
    ){}
}