namespace Igtampe.CDBFS.Common {
    public class CdbfsFolder : Editable{

        public int DriveId { get; set; } = 0;
        public int Id { get; set; } = 0;
        public int? ParentFolder { get; set; } = null;
        public string Name { get; set; } = "";

        public int FileCount { get; set; } = 0;
        public int FolderCount { get; set; } = 0;
        public long Size { get; set; } = 0;
        
    }
}
