export default class CdbfsFile{
    public constructor(
        public id:number,
        public drive : number,
        public folder:number,
        public name:string,
        public size:number,
        public mimeType:string,
        createTs : string,createUserId: string,updateTs: string,updateUserId: string,
    ){}
}