using Igtampe.CDBFS.Api.Requests;
using Igtampe.CDBFS.Common;
using Igtampe.CDBFS.Common.Exceptions;
using Igtampe.CDBFS.Data;
using Microsoft.AspNetCore.Mvc;
using static Igtampe.CDBFS.Api.Controllers.AuthController;
using static Igtampe.CDBFS.Api.Utils.MimeTypeToExtensionMapper;

namespace Igtampe.CDBFS.Api.Controllers {
    [ApiController]
    [Route("api/files")]
    public class FileController : ControllerBase {

        readonly CdbfsDAO dao;

        public FileController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        [HttpGet("{id}/data")]
        public async Task<IActionResult> DownloadFileData(int id) {
            var session = GetSession(Request, Response);
            CdbfsFile file = await dao.GetFile(session?.Username, id) ?? throw new CdbfsFileNotFoundException();
            byte[] data = await dao.GetFileData(session?.Username, id) ?? throw new CdbfsFileNotFoundException(); ;

            return File(data, file.MimeType, AppendExtension(file));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFile(int id) {
            var session = GetSession(Request, Response);
            CdbfsFile file = await dao.GetFile(session?.Username, id) ?? throw new CdbfsFileNotFoundException();
            return Ok(file);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFile([FromForm] FileRequest request, [FromForm] IFormFile file) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            if (file == null || file.Length == 0) { return BadRequest("No data!"); }
            if (request == null) { return BadRequest("No Metadata!!"); }


            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray(); // Convert to byte array

            await dao.CreateFile(session.Username, request.Drive, request.Folder, file.Name, fileBytes, file.ContentType);
            return Created();

        }

        [HttpPost("copy")]
        public async Task<IActionResult> CopyFile([FromBody] FileRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.CopyFile(session.Username, request.Id, request.Drive, request.Folder);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFile([FromForm] FileRequest request, [FromForm] IFormFile file) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            if (file == null || file.Length == 0) { return BadRequest("No data!"); }
            if (request == null) { return BadRequest("No Metadata!!"); }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray(); // Convert to byte array

            await dao.UpdateFile(session.Username,request.Id,fileBytes,file.ContentType);
            return Ok();
        }

        [HttpPut("rename")]
        public async Task<IActionResult> RenameFile([FromBody] FileRenameRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.RenameFile(session.Username,request.Id,request.Name);
            return Ok();

        }

        [HttpPut("move")]
        public async Task<IActionResult> MoveFile([FromBody] FileRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }
            await dao.MoveFile(session.Username, request.Id, request.Drive, request.Folder);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromBody] FileRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.DeleteFile(session.Username, request.Id);
            return Ok();
        }


    }
}
