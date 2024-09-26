import CdbfsDrive from "./CdbfsDrive";

export enum AccessLevel {
    READ = 0,
    WRITE = 1,
    OWNER = 2
}

export default class AccessRecord {
    public constructor(
        public id: number,
        public username: string,
        public driveId: number,
        public access: AccessLevel,
        public drive?: CdbfsDrive
    ) { }
}