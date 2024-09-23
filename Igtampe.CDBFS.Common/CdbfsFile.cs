namespace Igtampe.CDBFS.Common {
    public class CdbfsFile : Editable {

        public int Id { get; set; } = 0;
        public int Drive { get; set; } = 0;
        public int? Folder { get; set; } = 0;
        public string Name { get; set; } = "";
        public int Size { get; set; } = 0;
        public string MimeType { get; set; } = "";
    }
}
