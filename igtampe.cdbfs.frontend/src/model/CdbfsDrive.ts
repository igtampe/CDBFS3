import Editable from "./Editable"

export default class CdbfsDrive extends Editable {
    public constructor(
        public id: number,
        public name: string,
        public fileCount: number,
        public folderCount: number,
        public size: number,
        createTs: string, createUserId: string, updateTs: string, updateUserId: string,
    ) { super(createTs, createUserId, updateTs, updateUserId) }
}