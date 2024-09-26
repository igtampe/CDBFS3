import Editable from "./Editable";

export default class CdbfsFile extends Editable {
    public constructor(
        public id: number,
        public drive: number,
        public folder: number,
        public name: string,
        public size: number,
        public mimeType: string,
        createTs: string, createUserId: string, updateTs: string, updateUserId: string,
    ) { super(createTs, createUserId, updateTs, updateUserId) }
}