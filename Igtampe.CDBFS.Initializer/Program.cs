using Igtampe.CDBFS.Common;
using Igtampe.CDBFS.Data;
using static Igtampe.CDBFS.Data.Constants;

namespace Igtampe.CDBFS.Initializer {
    public class Program {

        static AdoTemplate? adoTemplate;

        public static async Task Main(string[] args) {
            Console.WriteLine("OK waos time to initialize");

            Console.WriteLine("Pause in case you ran this for no reason");

            if (Console.ReadLine() != "Avocado") {
                return;
            };

            var conString = "Host=nosy-manatee-1774.g8z.gcp-us-east1.cockroachlabs.cloud:26257;Database=cdbfs;Username=cdbfs;Password=hKSczPzOZQ6Gld12ZSjLAQ;";

            adoTemplate = new AdoTemplate(conString?.Trim() ?? "");

            DropAndCreateSchema(SCHEMA);

            var userTableSql = @$"
CREATE TABLE {USER_TABLE} (
	{USER_COLUMN} varchar(32) NOT NULL,
	{PASSWORD_COLUMN} varchar(64) NOT NULL,
	{ADMIN_COLUMN} bool default false,
    CONSTRAINT PK_USER PRIMARY KEY ({USER_COLUMN})	
);";

            var editableFieldsSql = $@"
{CRE_TS} TIMESTAMP(6) NOT NULL,
    {CRE_USR_ID} varchar(32) NOT NULL,
    {UPDT_TS} TIMESTAMP(6),
    {UPDT_USR_ID} varchar(32)
";

            var driveTableSql = @$"
CREATE TABLE {DRIVE_TABLE} (
	{DRIVE_ID_COLUMN} int4 GENERATED ALWAYS AS IDENTITY NOT NULL,
	{DRIVE_NAME_COLUMN} varchar(64),
    {editableFieldsSql},
    CONSTRAINT PK_DRIVE PRIMARY KEY ({DRIVE_ID_COLUMN})	
);";
            
            var folderTableSql = @$"
CREATE TABLE {FOLDER_TABLE} (
	{FOLDER_ID_COLUMN} int4 GENERATED ALWAYS AS IDENTITY NOT NULL,
    {DRIVE_ID_COLUMN} int4,
	{FOLDER_NAME_COLUMN} varchar(64),
    {PARENT_FOLDER_ID_COLUMN} int4,
    {editableFieldsSql},
    CONSTRAINT PK_FOLDER PRIMARY KEY ({FOLDER_ID_COLUMN}),
    CONSTRAINT FK_FOLDER_DRIVE FOREIGN KEY ({DRIVE_ID_COLUMN}) REFERENCES {DRIVE_TABLE}({DRIVE_ID_COLUMN}),
    CONSTRAINT FK_PARENT_FOLDER FOREIGN KEY ({PARENT_FOLDER_ID_COLUMN}) REFERENCES {FOLDER_TABLE}({FOLDER_ID_COLUMN})
);";


            var fileTableSql = @$"
CREATE TABLE {FILE_TABLE} (
	{FILE_ID_COLUMN} int4 GENERATED ALWAYS AS IDENTITY NOT NULL,
    {DRIVE_ID_COLUMN} int4,
    {FOLDER_ID_COLUMN} int4,
	{FILE_NAME_COLUMN} varchar(64),
    {FILE_TYPE_COLUMN} varchar(64),
    {FILE_DATA_COLUMN} BYTEA,
    {editableFieldsSql},
    CONSTRAINT PK_FILE PRIMARY KEY ({FILE_ID_COLUMN}),
    CONSTRAINT FK_FILE_FOLDER FOREIGN KEY ({FOLDER_ID_COLUMN}) REFERENCES {FOLDER_TABLE}({FOLDER_ID_COLUMN}),
    CONSTRAINT FK_FILE_DRIVE FOREIGN KEY ({DRIVE_ID_COLUMN}) REFERENCES {DRIVE_TABLE}({DRIVE_ID_COLUMN})
);";

            var accessRecordTableSql = @$"
CREATE TABLE {ACCESS_TABLE} (
	{ACCESS_ID_COLUMN} int4 GENERATED ALWAYS AS IDENTITY NOT NULL,
    {USER_COLUMN} varchar(32),
    {DRIVE_ID_COLUMN} int4,
    {ACCESS_LEVEL_COLUMN} int4,
    CONSTRAINT PK_ACCESS PRIMARY KEY ({ACCESS_ID_COLUMN}),
    CONSTRAINT FK_ACCESS_DRIVE FOREIGN KEY ({DRIVE_ID_COLUMN}) REFERENCES {DRIVE_TABLE}({DRIVE_ID_COLUMN})
);";

            //Select everything EXCEPT the data
            var fileViewSql = @$"
CREATE VIEW {FILE_VIEW} as 
select {string.Join(",",FILE_ID_COLUMN,DRIVE_ID_COLUMN,FOLDER_ID_COLUMN,FILE_NAME_COLUMN,FILE_TYPE_COLUMN,CRE_TS,CRE_USR_ID,UPDT_TS,UPDT_USR_ID)}, length({FILE_DATA_COLUMN}) as {FILE_SIZE_COLUMN} 
from {FILE_TABLE};
";

            var folderViewSql = $@"
CREATE VIEW {FOLDER_VIEW} as
select *,
 ( select count(*) from {FILE_TABLE} where {FOLDER_ID_COLUMN} =f.{FOLDER_ID_COLUMN}) as {FOLDER_FILE_COUNT_COLUMN},
 ( select count(*) from {FOLDER_TABLE} where {PARENT_FOLDER_ID_COLUMN} =f.{FOLDER_ID_COLUMN}) as {FOLDER_SUBFOLDER_COUNT_COLUMN},
 ( select sum(length({FILE_DATA_COLUMN})) from {FILE_TABLE} where {FOLDER_ID_COLUMN} = f.{FOLDER_ID_COLUMN} ) as {FOLDER_SIZE_COLUMN}
from {FOLDER_TABLE} f ;
";

            var driveViewSql = $@"
create view {DRIVE_VIEW} as
select *,
    (select count(*) from {FOLDER_VIEW} f where {DRIVE_ID_COLUMN}=d.{DRIVE_ID_COLUMN}) as {DRIVE_FOLDER_COUNT_COLUMN},
    (select count(*) from {FILE_VIEW} f where {DRIVE_ID_COLUMN}=d.{DRIVE_ID_COLUMN}) as {DRIVE_FILE_COUNT_COLUMN},
    (select sum({FILE_SIZE_COLUMN}) from {FILE_VIEW} where {DRIVE_ID_COLUMN} = d.{DRIVE_ID_COLUMN}) as {DRIVE_SIZE_COLUMN}
from {DRIVE_TABLE} d;

";

            var sqls = new List<string>{ 
                userTableSql, 
                driveTableSql, 
                folderTableSql, 
                fileTableSql, 
                accessRecordTableSql,
                fileViewSql,
                folderViewSql,
                driveViewSql

            };

            sqls.ForEach(async sql => {
                Console.WriteLine(sql);
                await adoTemplate.Execute(sql, (_) => { });
            });

            Console.WriteLine("Waos");

            var dummyData = @$"
insert into cdbfs.users ({USER_COLUMN},pass_tx,admin_in) values ('Chopo','',true);
insert into cdbfs.drives (drive_name,cre_ts, cre_usr_id) values ('Avocado',CURRENT_TIMESTAMP, 'Chopo');
insert into cdbfs.drives (drive_name,cre_ts, cre_usr_id) values ('NotAvocado',CURRENT_TIMESTAMP, 'NotChopo');
insert into cdbfs.files (drive_id , folder_id , file_nm , file_type_tx, file_data_tx, cre_ts , cre_usr_id  )
values (1,null,'Avocado.txt','text','WASO', CURRENT_TIMESTAMP, 'Chopo');

insert into cdbfs.folders (drive_id, folder_nm, cre_ts, cre_usr_id)
values (1,'Recipes',CURRENT_TIMESTAMP, 'Chopo');

insert into cdbfs.files (drive_id , folder_id , file_nm , file_type_tx, file_data_tx, cre_ts , cre_usr_id  )
values (1,1,'Guac.txt','text','WOSA', CURRENT_TIMESTAMP, 'Chopo');

insert into {ACCESS_TABLE} ({USER_COLUMN},drive_id,{ACCESS_LEVEL_COLUMN}) values ('chopo',1,{(int)Access.OWNER});
";

            await adoTemplate.Execute(dummyData);

        }

        static void DropAndCreateSchema(string schema) {
            var sql = @$"
DROP SCHEMA IF EXISTS {schema} CASCADE;
CREATE SCHEMA {schema};
";
            adoTemplate?.Execute(sql, (_) => { });
        }

      
    }
}
