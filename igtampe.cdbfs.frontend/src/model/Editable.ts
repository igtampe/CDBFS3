export default class Editable{
    public constructor(
        public createTs:string,
        public createUserId:string,
        public updateTs?:string,
        public updateUserId?:string
    ){}
}