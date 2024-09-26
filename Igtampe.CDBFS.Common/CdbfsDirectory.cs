namespace Igtampe.CDBFS.Common {
    public class CdbfsDirectory {

        public CdbfsDrive? Drive { get; set; }
        public CdbfsFolder? Folder { get; set; }
        
        public List<CdbfsFolder> Subfolders { get; set; } = [];
        public List<CdbfsFile> Files { get; set; } = [];

        public int FileCount => Files.Count;
        public int FolderCount => Subfolders.Count;
        public long FileSize => Files.Sum(a => a.Size);
        public long FoldersSize => Subfolders.Sum(a => a.Size);
        public long FolderSize => Folder?.Size ?? 0;
        public long DriveSize => Drive?.Size ?? 0;


    }
}
