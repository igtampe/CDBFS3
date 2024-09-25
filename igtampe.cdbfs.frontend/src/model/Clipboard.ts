export default class Clipboard{
    public constructor(
        public id : number,
        public type : 'FILE' | 'FOLDER'
    ){}
}