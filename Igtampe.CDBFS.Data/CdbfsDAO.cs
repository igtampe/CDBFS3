using Igtampe.CDBFS.Common;
using Igtampe.CDBFS.Common.Exceptions;
using NpgsqlTypes;
using System.Data;
using static Igtampe.CDBFS.Data.Constants;

namespace Igtampe.CDBFS.Data {
    public class CdbfsDAO(string connectionString) : ICdbfsDAO {

        readonly AdoTemplate adoTemplate = new(connectionString);

        private static readonly Func<IDataReader, AccessRecord> accessRecordRm = (reader) => new AccessRecord() {
            Id = reader.GetInt32(reader.GetOrdinal(ACCESS_ID_COLUMN)),
            Username = reader.GetString(reader.GetOrdinal(USER_COLUMN)),
            DriveId = reader.GetInt32(reader.GetOrdinal(DRIVE_ID_COLUMN)),
            Access = (Access)reader.GetInt32(reader.GetOrdinal(ACCESS_LEVEL_COLUMN))
        };

        private static readonly Func<IDataReader, CdbfsDrive> driveRm = (reader) => {
            var ent = new CdbfsDrive() {
                Id = reader.GetInt32(reader.GetOrdinal(DRIVE_ID_COLUMN)),
                Name = reader.GetString(reader.GetOrdinal(DRIVE_NAME_COLUMN)),
                FileCount = reader.GetInt32(reader.GetOrdinal(DRIVE_FILE_COUNT_COLUMN)),
                FolderCount = reader.GetInt32(reader.GetOrdinal(DRIVE_FOLDER_COUNT_COLUMN)),
                Size = reader.GetInt32(reader.GetOrdinal(DRIVE_SIZE_COLUMN))
            };
            return EditableOperations(reader, ent);
        };

        private static readonly Func<IDataReader, CdbfsFolder> folderRm = (reader) => {
            var ent = new CdbfsFolder() {
                Id = reader.GetInt32(reader.GetOrdinal(FOLDER_ID_COLUMN)),
                DriveId = reader.GetInt32(reader.GetOrdinal(DRIVE_ID_COLUMN)),
                ParentFolder = reader.GetInt32(reader.GetOrdinal(PARENT_FOLDER_ID_COLUMN)),
                Name = reader.GetString(reader.GetOrdinal(FOLDER_NAME_COLUMN)),
                FileCount = reader.GetInt32(reader.GetOrdinal(FOLDER_FILE_COUNT_COLUMN)),
                FolderCount = reader.GetInt32(reader.GetOrdinal(FOLDER_SUBFOLDER_COUNT_COLUMN)),
                Size = reader.GetInt32(reader.GetOrdinal(FOLDER_SIZE_COLUMN))
            };
            return EditableOperations(reader, ent);
        };

        private static readonly Func<IDataReader, CdbfsFile> fileRm = (reader) => {
            var ent = new CdbfsFile() {
                Id = reader.GetInt32(reader.GetOrdinal(FILE_ID_COLUMN)),
                Drive = reader.GetInt32(reader.GetOrdinal(DRIVE_ID_COLUMN)),
                Folder = reader.GetInt32(reader.GetOrdinal(FOLDER_ID_COLUMN)),
                Name = reader.GetString(reader.GetOrdinal(FILE_NAME_COLUMN)),
                MimeType = reader.GetString(reader.GetOrdinal(FILE_TYPE_COLUMN)),
                Size = reader.GetInt32(reader.GetOrdinal(FOLDER_SIZE_COLUMN))
            };
            return EditableOperations(reader, ent);
        };

        private static T EditableOperations<T>(IDataReader reader, T editable) where T : Editable {
            editable.CreateTs = reader.GetDateTime(reader.GetOrdinal(CRE_TS));
            editable.CreateUserId = reader.GetString(reader.GetOrdinal(CRE_USR_ID));
            editable.UpdateTs = reader.GetDateTime(reader.GetOrdinal(UPDT_TS));
            editable.UpdateUserId = reader.GetString(reader.GetOrdinal(UPDT_USR_ID));
            return editable;
        }

        #region GET

        #region Lists
        public async Task<List<AccessRecord>> AccessRecords(string? username) {
            var sql = $"SELECT * FROM {ACCESS_TABLE} WHERE {USER_COLUMN} = @username";
            return await adoTemplate.Query(sql,
                (setParam) => setParam("username", NpgsqlDbType.Varchar, username),
                accessRecordRm);
        }

        public async Task<List<AccessRecord>> AccessRecords(string? username, int drive) {
            var sql = $"SELECT * FROM {ACCESS_TABLE} WHERE {USER_COLUMN} = @username AND {DRIVE_ID_COLUMN} = @driveId";
            return await adoTemplate.Query(sql,
                (setParam) => {
                    setParam("username", NpgsqlDbType.Varchar, username);
                    setParam("driveId", NpgsqlDbType.Integer, drive);
                },
                accessRecordRm);
        }

        // <summary>This gets a list of drives the user can access</summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<List<CdbfsDrive>> Drives(string? username) {

            var sql = $@"
select * 
from {DRIVE_VIEW} 
where {DRIVE_ID_COLUMN} in (
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username OR {USER_COLUMN} = null
);"; //As long as the user has an access record, they can see the files.

            return await adoTemplate.Query(sql, (setParam) => setParam("username", NpgsqlDbType.Varchar, username), driveRm);

        }

        public async Task<List<CdbfsFolder>> Folders(string? username, int drive, int? folder) {
            await VerifyFolderInDrive(drive, folder);

            //We can do this all from one SQL
            var sql = $@"
select * 
from {FOLDER_VIEW} 
where 
{DRIVE_ID_COLUMN} = @drive AND --This is the drive we're looking for
{PARENT_FOLDER_ID_COLUMN} = @folder AND -- The folder
{DRIVE_ID_COLUMN} in ( --We have access to this drive
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username  OR {USER_COLUMN} = null
)

";

            if (folder != null) sql += $" "; //Drive is in the folder we want

            return await adoTemplate.Query(sql, (setParam) => {
                setParam("drive", NpgsqlDbType.Integer, drive);
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("folder", NpgsqlDbType.Integer, folder);
            }, folderRm);

        }

        public async Task<List<CdbfsFile>> Files(string? username, int drive, int? folder) {
            await VerifyFolderInDrive(drive, folder);
            var sql = $@"
select * 
from {FILE_VIEW} 
where {DRIVE_ID_COLUMN} = @drive AND --This is the drive we're looking for
{FOLDER_ID_COLUMN} = @folder AND -- The folder
{DRIVE_ID_COLUMN} in ( --We have access to this drive
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username  OR {USER_COLUMN} = null
)";

            return await adoTemplate.Query(sql, (setParam) => {
                setParam("drive", NpgsqlDbType.Integer, drive);
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("folder", NpgsqlDbType.Integer, folder);
            }, fileRm);

        }


        #endregion

        private async Task<CdbfsDrive?> GetDrive(string? username, int drive) {
            var sql = $@"
select * 
from {DRIVE_VIEW} 
where 
{DRIVE_ID_COLUMN} = @drive AND
{DRIVE_ID_COLUMN} in (
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username OR {USER_COLUMN} = null
);"; //As long as the user has an access record, they can see the files.

            return await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("id", NpgsqlDbType.Integer, drive);
                setParam("username", NpgsqlDbType.Varchar, username);
            }, driveRm);

        }

        public async Task<CdbfsDirectory> Dir(string? username, int driveId, int? folderId) {

            var drive = await GetDrive(username, driveId);
            if (drive != null) { throw new CdbfsFileNotFoundException(); }

            await VerifyFolderInDrive(driveId, folderId);
            var folder = folderId ==null ? null : await GetFolder(folderId ?? 0);

            return new() {
                Drive = drive,
                Folder = folder,
                Subfolders = await Folders(username, driveId, folderId),
                Files = await Files(username,driveId, folderId)
            };
        }

        public async Task<CdbfsFile?> GetFile(string? username, int id) {
            var sql = $@"
select * 
from {FILE_VIEW} 
where {FILE_ID_COLUMN} = @file AND --This is the drive we're looking for
{DRIVE_ID_COLUMN} in ( --We have access to this drive
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username  OR {USER_COLUMN} = null
)";

            return await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("file", NpgsqlDbType.Integer, id);
                setParam("username", NpgsqlDbType.Varchar, username);
            }, fileRm);
        }

        public async Task<byte[]> GetFileData(string? username, int file) {

            var sql = $@"
select {FILE_DATA_COLUMN} 
from {FILE_TABLE}
where {FILE_ID_COLUMN} = @file AND --This is the drive we're looking for
{DRIVE_ID_COLUMN} in ( --We have access to this drive
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username  OR {USER_COLUMN} = null
";

            return await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("file", NpgsqlDbType.Integer, file);
                setParam("username", NpgsqlDbType.Varchar, username);
            }, (reader) => (byte[])reader[FILE_DATA_COLUMN]) ?? throw new CdbfsFileNotFoundException();

        }

        #endregion

        #region FOLDER

        private async Task<CdbfsFolder?> GetFolder(int folder) {
            var sql = $"SELECT * FROM {FOLDER_VIEW} WHERE {FOLDER_ID_COLUMN} = @id";
            return await adoTemplate.QuerySingle(sql, (setParam) => setParam("id",NpgsqlDbType.Integer,folder), folderRm);
        }

        public async Task<int> CreateFolder(string username, int drive, int? parent_folder, string name) {
            await VerifyFolderInDrive(drive, parent_folder);
            await VerifyCanEditDrive(username, drive);

            var sql = $@"
INSERT INTO ${FILE_TABLE} ({DRIVE_ID_COLUMN},{PARENT_FOLDER_ID_COLUMN},{CRE_TS}, {CRE_USR_ID})
values (@drive,@folder,CURRENT_TIMESTAMP,@user) returning {FOLDER_ID_COLUMN}";

            return await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("drive", NpgsqlDbType.Integer, drive);
                setParam("folder", NpgsqlDbType.Integer, parent_folder);
                setParam("user", NpgsqlDbType.Integer, username);

            }, (reader) => reader.GetInt32(reader.GetOrdinal(FOLDER_ID_COLUMN)));

        }

        public async Task<int> CopyFolder(string username, int folder, int destinationDrive, int? destinationFolder) {
            await VerifyFolderInDrive(destinationDrive, destinationFolder);
            await VerifyCanEditFolder(username, folder);
            //We're going to need to figure out how to do deep copies


            //Get the folder
            var f = await GetFolder(folder) ?? throw new CdbfsFileNotFoundException();

            //Finally the folder count is empty so we can delete ourselves

            var folderCopyId = await CreateFolder(username, destinationDrive, destinationFolder, f.Name); 

            if (f.FolderCount > 0) {
                var subfolders = await Folders(username, f.DriveId, f.Id);
                subfolders.ForEach(async a => await CopyFolder(username,a.Id,destinationDrive,folderCopyId));
            };

            //Copy the files
            if (f.FileCount > 0) {
                var files = await Files(username, f.DriveId, f.Id);
                files.ForEach(async a => await CreateFile(username,destinationDrive,folderCopyId,f.Name,await GetFileData(username,f.Id),a.MimeType));
            };

            return folderCopyId;


        }

        public async Task MoveFolder(string username, int folder, int destinationDrive, int? destinationFolder) {
            await VerifyFolderInDrive(destinationDrive, destinationFolder);
            await VerifyCanEditFolder(username, folder);

            //Just change the drive and or parent folder

            var sql = $@"
UPDATE {FOLDER_TABLE} SET
    {DRIVE_ID_COLUMN} = @drive,
    {PARENT_FOLDER_ID_COLUMN} = @folder,
    {UPDT_TS} = CURRENT_TIMESTAMP,
    {UPDT_USR_ID} = @username
WHERE
    {FOLDER_ID_COLUMN} = @id
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("drive", NpgsqlDbType.Integer, destinationDrive);
                setParam("folder", NpgsqlDbType.Integer, destinationFolder);
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("id", NpgsqlDbType.Integer, folder);
            });

        }

        public async Task RenameFolder(string username, int folder, string newName) {
            await VerifyCanEditFolder(username, folder);
            
            //Change the name lmao
            var sql = $@"
UPDATE {FOLDER_TABLE} SET
    {FOLDER_NAME_COLUMN} = @name,
    {UPDT_TS} = CURRENT_TIMESTAMP,
    {UPDT_USR_ID} = @username
WHERE
    {FOLDER_ID_COLUMN} = @id
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("name", NpgsqlDbType.Varchar, newName);
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("id", NpgsqlDbType.Integer, folder);
            });

        }

        public async Task DeleteFolder(string username, int folder) {
            await VerifyCanEditFolder(username, folder);

            //Get the folder
            var f = await GetFolder(folder) ?? throw new CdbfsFileNotFoundException();

            if (f.FolderCount > 0) {
                var subfolders = await Folders(username, f.DriveId, f.Id);
                subfolders.ForEach(async a => await DeleteFolder(username, a.Id));
            };

            if (f.FileCount > 0) {
                var files = await Files(username, f.DriveId, f.Id);  
                files.ForEach(async a=> await DeleteFile(username, a.Id));
            };

            //Finally the folder count is empty so we can delete ourselves
            var sql = $@"DELETE FROM {FOLDER_TABLE} WHERE {FOLDER_ID_COLUMN} = @id";
            await adoTemplate.Execute(sql, (setParam) => setParam("id", NpgsqlDbType.Integer, folder));

        }

        #endregion

        #region DRIVE

        public async Task Format(string username, int drive) {
            //Nuke the drive

            await VerifyDriveOwner(username, drive);


            //Delete all the files
            var nukeSqlBatch = @$"
DELETE FROM {FILE_TABLE} WHERE {DRIVE_ID_COLUMN} = @drive;
DELETE FROM {FOLDER_TABLE} where {DRIVE_ID_COLUMN} = @drive;
";

            await adoTemplate.Execute(nukeSqlBatch, (setParam) => setParam("drive", NpgsqlDbType.Varchar, drive));

        }

        public async Task<int> CreateDrive(string username, string name) {
            //Create the drive

            var createDriveSql = $@"
INSERT INTO {DRIVE_TABLE} ({DRIVE_NAME_COLUMN},{CRE_TS},{CRE_USR_ID})
VALUES (@driveName, CURRENT_TIMESTAMP, @user)
RETURNING {DRIVE_ID_COLUMN}
";

            var id = await adoTemplate.QuerySingle(createDriveSql, (setParam) => {
                setParam("driveName", NpgsqlDbType.Varchar, name);
                setParam("user", NpgsqlDbType.Varchar, username);
            }, (reader)=>reader.GetInt32(1));

            //Manually add an access record
            await InternalAddAccessRecord(new AccessRecord() { 
                Access= Access.OWNER,
                DriveId = id,
                Username = username
            });

            return id;
            
        }

        public async Task DeleteDrive(string username, int drive) {
            //Nuke the drive and remove the drive
            await VerifyDriveOwner(username, drive);
            if (await OwnerCount(drive) > 1) {
                throw new CdbfsNotAuthorizedException();
            }

            await Format(username, drive);

            var sql = $@"DELETE FROM {DRIVE_TABLE} WHERE {DRIVE_ID_COLUMN} = @id";
            await adoTemplate.Execute(sql, (setParam) => setParam("id", NpgsqlDbType.Integer, drive));

        }

        public async Task RenameDrive(string username, int drive, string name) {
            //Just rename the drive
            await VerifyDriveOwner(username, drive);

            var sql = $@"
UPDATE {DRIVE_TABLE} SET 
    {DRIVE_NAME_COLUMN} = @driveName, 
    {UPDT_TS} = CURRENT_TIMESTAMP, 
    {UPDT_USR_ID} = @username
WHERE
    {DRIVE_ID_COLUMN} = @id
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("driveName",NpgsqlDbType.Varchar,name);
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("id", NpgsqlDbType.Integer, drive);
            });

        }

        #endregion

        #region ACCESS RECORD

        private async Task<AccessRecord?> GetAccessRecord(int recordId) {
            var sql = $@"
SELECT * FROM {ACCESS_TABLE} WHERE {ACCESS_ID_COLUMN} = @id
";

            return await adoTemplate.QuerySingle(sql, (setParam) => setParam("id", NpgsqlDbType.Integer, recordId), accessRecordRm);
        }

        private async Task<int> OwnerCount(int drive) {
            var sql = $@"
SELECT count(*) FROM {ACCESS_TABLE} 
WHERE {DRIVE_ID_COLUMN} = @id AND {ACCESS_LEVEL_COLUMN} > 1
";

            return await adoTemplate.QuerySingle(sql, (setParam) => setParam("id", NpgsqlDbType.Integer, drive), (reader)=>reader.GetInt32(0));
        }

        public async Task<int> AddAccessRecord(string username, AccessRecord accessRecord) {
            //Add the record
            await VerifyDriveOwner(username, accessRecord.DriveId);
            return await InternalAddAccessRecord(accessRecord);
        }

        private async Task<int> InternalAddAccessRecord(AccessRecord accessRecord) {
            var sql = $@"
INSERT INTO {ACCESS_TABLE} ({DRIVE_ID_COLUMN}, {USER_COLUMN}, {ACCESS_LEVEL_COLUMN})
VALUES (@id,@username,@access)
";

            return await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("access", NpgsqlDbType.Integer, (int)accessRecord.Access);
                setParam("username", NpgsqlDbType.Varchar, accessRecord.Username);
                setParam("id", NpgsqlDbType.Integer, accessRecord.DriveId);
            }, (reader) => reader.GetInt32(1));
        }

        public async Task UpdateAccessRecord(string username, int id, Access access) {
            //Get the record
            var record = await GetAccessRecord(id) ?? throw new CdbfsFileNotFoundException();

            //Verify this person can actually make a change at all
            if (record.Username == username) {
                throw new SelfAccessEditException();
            }
            await VerifyDriveOwner(username, id);

            //If this record is an owner, and we're trying to make them not an owner, and there's currently only one owner in this drive
            if (record.Access == Access.OWNER && access != Access.OWNER && await OwnerCount(record.DriveId) == 1) {
                throw new NoOwnersException(); //No
            }

            var sql = $@"
UPDATE {ACCESS_TABLE} SET {ACCESS_LEVEL_COLUMN} = @access WHERE {ACCESS_ID_COLUMN} = @id
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("access", NpgsqlDbType.Integer, (int)access);
                setParam("id", NpgsqlDbType.Integer, id);
            });

        }

        public async Task DeleteAccessRecord(string username, int recordId) {
            //Delete the record
            var record = await GetAccessRecord(recordId) ?? throw new CdbfsFileNotFoundException();
            await VerifyDriveOwner(username, record.DriveId);

            if (record.Access == Access.OWNER && await OwnerCount(record.DriveId) == 1) {
                throw new NoOwnersException();
            }

            var sql = $@"DELETE FROM {ACCESS_TABLE} WHERE {ACCESS_ID_COLUMN} = @id";

            await adoTemplate.Execute(sql, (setParam) => setParam("id",NpgsqlDbType.Integer,recordId));

        }

        async Task VerifyDriveOwner(string username, int drive) {

            var sql = @$"
SELECT count(*) 
FROM {ACCESS_TABLE} 
WHERE {USER_COLUMN} = @username AND 
{DRIVE_ID_COLUMN} = @drive AND 
{ACCESS_LEVEL_COLUMN} > 1
";

            if (!await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("drive", NpgsqlDbType.Integer, drive);
            }, (reader) => reader.GetInt32(1) > 0)) {
                throw new CdbfsNotAuthorizedException();
            }
        }

        async Task VerifyCanEditDrive(string username, int drive) {

            var sql = @$"
SELECT count(*) 
FROM {ACCESS_TABLE} 
WHERE {USER_COLUMN} = @username AND 
{DRIVE_ID_COLUMN} = @drive AND 
{ACCESS_LEVEL_COLUMN} > 0
";

            if (!await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("drive", NpgsqlDbType.Integer, drive);
            }, (reader) => reader.GetInt32(1) > 0)) {
                throw new CdbfsNotAuthorizedException();
            }
        }

        async Task VerifyCanEditFolder(string username, int folder) {

            var sql = @$"
SELECT count(*) 
FROM {FOLDER_TABLE} 
WHERE {FOLDER_ID_COLUMN} = @folder AND 
{DRIVE_ID_COLUMN} in ( --We have access to this drive
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username AND
    {ACCESS_LEVEL_COLUMN} > 0
)
";

            if (!await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("folder", NpgsqlDbType.Integer, folder);
            }, (reader) => reader.GetInt32(1) > 0)) {
                throw new CdbfsNotAuthorizedException();
            }

        }

        async Task VerifyCanEditFile(string username, int file) {

            var sql = @$"
SELECT count(*) 
FROM {FILE_TABLE} 
WHERE {FILE_ID_COLUMN} = @file AND 
{DRIVE_ID_COLUMN} in ( --We have access to this drive
    select {DRIVE_ID_COLUMN} 
    from {ACCESS_TABLE} 
    WHERE {USER_COLUMN} = @username AND
    {ACCESS_LEVEL_COLUMN} > 0
)
";

            if (!await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("file", NpgsqlDbType.Integer, file);
            }, (reader) => reader.GetInt32(1) > 0)) {
                throw new CdbfsNotAuthorizedException();
            }

        }


        //Do another one to check if canEdit Folder and canEditFile

        #endregion

        #region FILE

        public async Task<int> CreateFile(string username, int drive, int? folder, string name, byte[] data, string mimeType) {
            await VerifyFolderInDrive(drive, folder);
            //Create the file, return the ID
            await VerifyCanEditDrive(username, drive);

            var sql = @$"
INSERT INTO {FILE_TABLE} ({DRIVE_ID_COLUMN},{FOLDER_ID_COLUMN},{FILE_NAME_COLUMN},{FILE_DATA_COLUMN},{FILE_TYPE_COLUMN},{CRE_TS},{CRE_USR_ID})
VALUES (@drive,@folder,@filename,@fileData,@fileType,CURRENT_TIMESTAMP,@username)
RETURNING {FILE_ID_COLUMN}
";

            return await adoTemplate.QuerySingle(sql, (setParam) => {
                setParam("drive", NpgsqlDbType.Integer, drive);
                setParam("folder", NpgsqlDbType.Integer, folder);
                setParam("filename", NpgsqlDbType.Varchar, name);
                setParam("fileData", NpgsqlDbType.Bytea, data);
                setParam("fileType", NpgsqlDbType.Varchar, mimeType);
                setParam("username", NpgsqlDbType.Varchar, username);
            }, (reader)=>reader.GetInt32(1));

        }

        public async Task UpdateFile(string username, int file, byte[] data, string mimeType) {
            //Update the file's contents
            await VerifyCanEditFile(username, file);

            var sql = $@"
UPDATE {FILE_TABLE} SET {FILE_DATA_COLUMN} = @fileData, {FILE_TYPE_COLUMN} = @fileType, {UPDT_TS} = CURRENT_TIMESTAMP, {UPDT_USR_ID} = @username
WHERE {FILE_ID_COLUMN} = @fileId
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("fileData", NpgsqlDbType.Bytea, data);
                setParam("fileType", NpgsqlDbType.Varchar, mimeType);
                setParam("fileId", NpgsqlDbType.Integer, file);
                setParam("username", NpgsqlDbType.Varchar, username);
            });

        }

        public async Task RenameFile(string username, int file, string name) {
            //Rename the file
            await VerifyCanEditFile(username, file);

            var sql = $@"
UPDATE {FILE_TABLE} SET {FILE_NAME_COLUMN} = @filename, {UPDT_TS} = CURRENT_TIMESTAMP, {UPDT_USR_ID} = @username
WHERE {FILE_ID_COLUMN} = @fileId
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("filename", NpgsqlDbType.Bytea, name);
                setParam("fileId", NpgsqlDbType.Integer, file);
                setParam("username", NpgsqlDbType.Varchar, username);
            });
        }

        public async Task MoveFile(string username, int file, int destinationDrive, int? destinationFolder) {
            await VerifyFolderInDrive(destinationDrive, destinationFolder);
            await VerifyCanEditFile(username, file);
            await VerifyCanEditDrive(username, destinationDrive);
            
            //Just move the file
            var sql = $@"
UPDATE {FILE_TABLE} SET {DRIVE_ID_COLUMN} = @drive, {FOLDER_ID_COLUMN} = @folder, {UPDT_TS} = CURRENT_TIMESTAMP, {UPDT_USR_ID} = @username
WHERE {FILE_ID_COLUMN} = @fileId
";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("drive", NpgsqlDbType.Integer, destinationDrive);
                setParam("folder", NpgsqlDbType.Integer, destinationFolder);
                setParam("fileId", NpgsqlDbType.Integer, file);
                setParam("username", NpgsqlDbType.Varchar, username);
            });

        }

        public async Task<int> CopyFile(string username, int file, int destinationDrive, int? destinationFolder) {
            //Load the file then write it somewhere else
            await VerifyFolderInDrive(destinationDrive, destinationFolder);
            await VerifyCanEditFile(username, file);
            await VerifyCanEditDrive(username, destinationDrive);

            var metadataSql = $@"SELECT * FROM {FILE_VIEW} WHERE {FILE_ID_COLUMN} = @id";
            

            //Get the file 
            CdbfsFile? fileMetaData = await adoTemplate.QuerySingle(metadataSql, 
                (setParam) => setParam("id", NpgsqlDbType.Integer, file), fileRm);

            byte[]? fileData = await GetFileData(username, file);


            return fileMetaData == null
                ? throw new CdbfsFileNotFoundException()
                : await CreateFile(username, destinationDrive, destinationFolder, fileMetaData.Name, fileData, fileMetaData.MimeType);
        }

        public async Task DeleteFile(string username, int file) {
            await VerifyCanEditFile(username, file);
            var sql = $@"DELETE FROM {FILE_TABLE} WHERE {FILE_ID_COLUMN} = @file";
            await adoTemplate.Execute(sql, (setParam) => setParam("file",NpgsqlDbType.Integer,file));
        }

        private async Task VerifyFolderInDrive(int drive, int? folder) {
            if (folder == null) return;

            var f = await GetFolder(folder ?? 0) ?? throw new CdbfsFileNotFoundException();
            if (f.DriveId != drive) {
                throw new CdbfsFolderNotInDriveException();
            }

        }

        #endregion 

    }
}
