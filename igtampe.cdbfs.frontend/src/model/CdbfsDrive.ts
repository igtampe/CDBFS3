export default class CdbfsDrive{
    public constructor(
        public id : number,
        public name: string,
        public fileCount:number,
        public folderCount:number,
        public size:number
    ){}
}