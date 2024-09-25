export default class FolderRequest{
    public constructor(
        public id:number,
        public drive:number,
        public name:string,
        public parentFolder?:number
    ){}
}