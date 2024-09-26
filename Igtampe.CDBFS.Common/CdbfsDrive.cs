namespace Igtampe.CDBFS.Common {
    public class CdbfsDrive : Editable {
        public int Id { get; set; } = 0;
        public string Name { get; set; } = "";
        public int FileCount { get; set; } = 0;
        public int FolderCount { get; set; } = 0;
        public long? Size { get; set; } = 0;
    }
}
