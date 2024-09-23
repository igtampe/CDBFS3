namespace Igtampe.CDBFS.Api.Requests {
    public class FolderRequest {
        public int Id { get; set; } = 0;
        public int Drive { get; set; } = 0;
        public int? ParentFolder { get; set; } = null;
        public string Name { get; set; } = "";
    }
}
