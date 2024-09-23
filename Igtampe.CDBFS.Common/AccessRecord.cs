namespace Igtampe.CDBFS.Common {

    public enum Access {
        READ = 0,
        WRITE = 1,
        OWNER = 2,
    };

    public class AccessRecord {
        public int Id { get; set; }

        /// <summary>Specific username this record relates to. If it's null, it means this is the entry for public access</summary>
        public string? Username { get; set; } = null;

        public int DriveId { get; set; } = 0;

        /// <summary>Allows a user to Read all the files </summary>
        public Access Access { get; set; } = Access.READ;

    }
}
