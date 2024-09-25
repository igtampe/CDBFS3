import Editable from "./Editable";

export default class CdbfsFolder extends Editable{
    public constructor(
        public id : number,
        public driveId : number,
        public name:string,
        public fileCount:number,
        public folderCount:number,
        public size:number,
        createTs : string,createUserId: string,updateTs?: string,updateUserId?: string,
        public parentFolder?: number,
    ){
        super(createTs,createUserId,updateTs,updateUserId)
    }
}