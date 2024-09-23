namespace Igtampe.CDBFS.Common {
    public abstract class Editable {
        public DateTime CreateTs { get; set; } = DateTime.Now;
        public string CreateUserId { get; set; } = "";
        public DateTime? UpdateTs { get; set; } = null;
        public string? UpdateUserId { get; set; } = "";

    }
}
