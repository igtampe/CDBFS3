namespace Igtampe.CDBFS.Data {
    public static class Constants {

        public static readonly string SCHEMA = "cdbfs";

        public static readonly string USER_TABLE = $"{SCHEMA}.users";
        public static readonly string USER_COLUMN = "user_nm";
        public static readonly string PASSWORD_COLUMN = "pass_tx";
        public static readonly string ADMIN_COLUMN = "admin_in";

        public static readonly string ACCESS_VIEW = $"{SCHEMA}.accessView";
        public static readonly string ACCESS_TABLE = $"{SCHEMA}.accessRecords";
        public static readonly string ACCESS_ID_COLUMN = "access_id";
        public static readonly string ACCESS_LEVEL_COLUMN = "access_level_nb";
        
        public static readonly string FILE_TABLE = $"{SCHEMA}.files";
        public static readonly string FILE_VIEW = $"{SCHEMA}.fileView";
        public static readonly string FILE_ID_COLUMN = "file_id";
        public static readonly string FILE_NAME_COLUMN = "file_nm";
        public static readonly string FILE_DATA_COLUMN = "file_data_tx";
        public static readonly string FILE_TYPE_COLUMN = "file_type_tx";
        public static readonly string FILE_SIZE_COLUMN = "file_size_nb";

        public static readonly string FOLDER_TABLE = $"{SCHEMA}.folders";
        public static readonly string FOLDER_VIEW = $"{SCHEMA}.folderView";
        public static readonly string FOLDER_ID_COLUMN = "folder_id";
        public static readonly string PARENT_FOLDER_ID_COLUMN = "parent_folder_id";
        public static readonly string FOLDER_NAME_COLUMN = "folder_nm";
        public static readonly string FOLDER_SIZE_COLUMN = "folder_size_nb";
        public static readonly string FOLDER_FILE_COUNT_COLUMN = "folder_file_ct";
        public static readonly string FOLDER_SUBFOLDER_COUNT_COLUMN = "folder_subfolder_ct";

        public static readonly string DRIVE_TABLE = $"{SCHEMA}.drives";
        public static readonly string DRIVE_VIEW = $"{SCHEMA}.driveView";
        public static readonly string DRIVE_ID_COLUMN = $"drive_id";
        public static readonly string DRIVE_NAME_COLUMN = $"drive_name";
        public static readonly string DRIVE_SIZE_COLUMN = $"drive_size_nb";
        public static readonly string DRIVE_FILE_COUNT_COLUMN = $"drive_file_ct";
        public static readonly string DRIVE_FOLDER_COUNT_COLUMN = $"drive_folder_ct";

        public static readonly string CRE_TS = "cre_ts";
        public static readonly string CRE_USR_ID = "cre_usr_id";
        public static readonly string UPDT_TS = "updt_ts";
        public static readonly string UPDT_USR_ID = "updt_usr_id";

    }
}
