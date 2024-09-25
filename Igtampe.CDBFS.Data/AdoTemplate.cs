using Npgsql;
using NpgsqlTypes;
using System.Data;
using Igtampe.BasicLogger;

namespace Igtampe.CDBFS.Data {

    public class AdoTemplate(string connectionString) {

        private static readonly BasicLogger.BasicLogger log = new(LogSeverity.DEBUG);

        private readonly string ConnectionString = connectionString;
        private static readonly string TEST_QUERY = "SELECT 1";

        public async Task<T?> QuerySingle<T>(string sql, Action<Action<string, NpgsqlDbType, object?>> setter, Func<IDataReader, T> rowMapper) {
            return (await Query(sql, setter, rowMapper)).FirstOrDefault();
        }

        public async Task<List<T>> Query<T>(string sql, Action<Action<string,NpgsqlDbType,object?>> setter, Func<IDataReader, T> rowMapper) {
            var results = new List<T>();

            using var conn = new NpgsqlConnection(ConnectionString);
            await conn.OpenAsync();
            
            using var cmd = new NpgsqlCommand(sql, conn);

            void setParam(string key, NpgsqlDbType type, object? val) {
                cmd.Parameters.Add(new NpgsqlParameter(key, type) { Value = val ?? DBNull.Value });
            }

            setter(setParam);

            log.Debug(sql);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) { results.Add(rowMapper(reader));}

            return results;

        }

        public async Task<int> Execute(string sql) { return await Execute(sql, (_) => { });}

        public async Task<int> Execute(string sql, Action<Action<string, NpgsqlDbType, object?>> setter) {
            using var conn = new NpgsqlConnection(ConnectionString);
            await conn.OpenAsync();


            using var cmd = new NpgsqlCommand(sql, conn);

            void setParam(string key, NpgsqlDbType type, object? val) {
                cmd.Parameters.Add(new NpgsqlParameter(key, type) { Value = val ?? DBNull.Value});
            }

            setter(setParam);

            log.Debug(sql);

            return await cmd.ExecuteNonQueryAsync();
        }

    }
}
