namespace Igtampe.CDBFS.Common {
    public class CdbfsDirectory {

        public CdbfsDrive? Drive { get; set; }
        public CdbfsFolder? Folder { get; set; }
        
        public List<CdbfsFolder> Subfolders { get; set; } = [];
        public List<CdbfsFile> Files { get; set; } = [];

        public int FileCount => Files.Count;
        public int FolderCount => Subfolders.Count;
        public int FileSize => Files.Sum(a => a.Size);
        public int FoldersSize => Subfolders.Sum(a => a.Size);
        public int FolderSize => Folder?.Size ?? 0;
        public int DriveSize => Drive?.Size ?? 0;


    }
}
