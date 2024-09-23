namespace Igtampe.CDBFS.Common {


    public interface ICdbfsDAO {

        Task<List<AccessRecord>> AccessRecords(string? username);
        Task<List<AccessRecord>> AccessRecords(string? username, int drive);
        Task<List<CdbfsDrive>> Drives(string? username);
        Task<List<CdbfsFolder>> Folders(string? username, int drive, int? folder);
        Task<List<CdbfsFile>> Files(string username, int drive, int? folder);
        Task<byte[]> GetFileData(string? username, int file);
        Task<int> CreateFolder(string username, int drive, int? parent_folder, string name);
        Task<int> CopyFolder(string username, int folder, int destinationDrive, int? destinationFolder);
        Task MoveFolder(string username, int folder, int destinationDrive, int? destinationFolder);
        Task RenameFolder(string username, int folder, string newName);
        Task DeleteFolder(string username, int folder);        
        Task Format(string username, int drive);
        Task<int> CreateDrive(string username, string name);
        Task DeleteDrive(string username, int drive);
        Task RenameDrive(string username, int drive, string name);
        Task<int> AddAccessRecord(string username, AccessRecord accessRecord);
        Task UpdateAccessRecord(string username, int id, Access access);
        Task DeleteAccessRecord(string username, int recordId);   
        Task<int> CreateFile(string username, int drive, int? folder, string name, byte[] data, string mimeType);
        Task UpdateFile(string username, int file, byte[] data, string mimeType);
        Task RenameFile(string username, int file, string name);
        Task MoveFile(string username, int file, int destinationDrive, int? destinationFolder);
        Task<int> CopyFile(string username, int file, int destinationDrive, int? destinationFolder);
        Task DeleteFile(string username, int file);
    }
}
