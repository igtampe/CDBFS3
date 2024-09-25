using Igtampe.CDBFS.Common;
using NpgsqlTypes;
using static Igtampe.CDBFS.Data.Constants;

namespace Igtampe.CDBFS.Data {
    public class UserDAO(string connectionString) {
        
        readonly Hashbrown.Hashbrown hashbrown = new();
        readonly AdoTemplate adoTemplate = new(connectionString);

        readonly EnvironmentKey registerKey = new("REGISTER_KEY");
        readonly EnvironmentKey adminKey = new("ADMIN_KEY");

        public async Task<User?> GetUser(string username) {
            var sql = $@"SELECT {USER_COLUMN},{ADMIN_COLUMN} FROM {USER_TABLE} WHERE {USER_COLUMN} = @username";
            return await adoTemplate.QuerySingle(sql, (setParam) => setParam("username", NpgsqlDbType.Varchar, username), (reader) => {
                return new User() {
                    Username = reader.GetString(reader.GetOrdinal(USER_COLUMN)),
                    IsAdmin = reader.GetBoolean(reader.GetOrdinal(ADMIN_COLUMN))
                };
            });
        }

        public async Task<bool> Authenticate(string username, string password) { 

            var sql = $"SELECT COUNT(*) FROM {USER_TABLE} WHERE {USER_COLUMN} = @username AND {PASSWORD_COLUMN} = @password";

            return await adoTemplate.QuerySingle(sql, 
                (setParam) => {
                    setParam("username", NpgsqlDbType.Varchar, username);
                    setParam("password", NpgsqlDbType.Varchar, hashbrown.Hash(password));
                },
                (reader) => reader.GetInt32(0) > 0);
        
        }

        public async Task Register(string username, string password, string key) {

            var admin = key.Equals(adminKey.ToString());
            if (!admin && !key.Equals(registerKey.ToString())) {
                throw new ArgumentException("Registration key is incorrect");
            }

            var sql = $"INSERT INTO {USER_TABLE} ({string.Join(",", [USER_COLUMN,PASSWORD_COLUMN,ADMIN_COLUMN])}) VALUES (@username, @password, @admin)";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("password", NpgsqlDbType.Varchar, hashbrown.Hash(password));
                setParam("admin", NpgsqlDbType.Boolean, admin);
            });
        }

        public async Task UpdatePassword(string username, string oldPassword, string newPassword) {

            if (!await Authenticate(username, oldPassword)) {
                throw new ArgumentException("Incorrect password");
            }
            
            var sql = $"UPDATE {USER_TABLE} SET {PASSWORD_COLUMN} = @password WHERE {USER_COLUMN} = @username";

            await adoTemplate.Execute(sql, (setParam) => {
                setParam("username", NpgsqlDbType.Varchar, username);
                setParam("password", NpgsqlDbType.Varchar, hashbrown.Hash(newPassword));
            });
        }


    }
}
