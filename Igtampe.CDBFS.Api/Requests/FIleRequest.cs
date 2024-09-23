namespace Igtampe.CDBFS.Api.Requests {
    public class FileRequest {
        public int Id { get; set; } = 0;
        public int Drive { get; set; } = 0;
        public int? Folder { get; set; } = null;
    }
}
