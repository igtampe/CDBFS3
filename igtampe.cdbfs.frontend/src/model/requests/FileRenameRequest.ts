import FileRequest from "./FileRequest";

export default class FileRenameRequest extends FileRequest{
    public constructor(
        public name:string,
        id:number,
        drive:number,
        folder?:number,
    ){ super(id,drive,folder)}
}