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
            try {
                CdbfsFile file = await dao.GetFile(session?.Username, id) ?? throw new CdbfsFileNotFoundException();
                byte[] data = await dao.GetFileData(session?.Username, id) ?? throw new CdbfsFileNotFoundException(); ;
                
                Response.Headers.Add("Content-Disposition", "inline; filename=" + AppendExtension(file));

                return File(data, file.MimeType);
            }
            catch (CdbfsFileNotFoundException) {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFile(int id) {
            var session = GetSession(Request, Response);
            CdbfsFile? file = await dao.GetFile(session?.Username, id);
            return file==null ? NotFound() : Ok(file);
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

            try { await dao.CreateFile(session.Username, request.Drive, request.Folder < 0 ? null : request.Folder, file.FileName, fileBytes, file.ContentType); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }
            catch (CdbfsFolderNotInDriveException) {
                return BadRequest(new ProblemDetails() {
                    Status = 400,
                    Detail = "Folder is not present in given drive"
                });
            }

            return Created();

        }

        [HttpPost("copy")]
        public async Task<IActionResult> CopyFile([FromBody] FileRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.CopyFile(session.Username, request.Id, request.Drive, request.Folder); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }
            catch (CdbfsFileNotFoundException) { return NotFound(); }
            catch (CdbfsFolderNotInDriveException) {
                return BadRequest(new ProblemDetails() {
                    Status = 400,
                    Detail = "Folder is not present in given drive"
                });
            }

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

            try { await dao.UpdateFile(session.Username, request.Id, fileBytes, file.ContentType); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }

            return Ok();
        }

        [HttpPut("rename")]
        public async Task<IActionResult> RenameFile([FromBody] FileRenameRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.RenameFile(session.Username, request.Id, request.Name); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }

            return Ok();

        }

        [HttpPut("move")]
        public async Task<IActionResult> MoveFile([FromBody] FileRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.MoveFile(session.Username, request.Id, request.Drive, request.Folder); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }
            catch (CdbfsFolderNotInDriveException) {
                return BadRequest(new ProblemDetails() {
                    Status = 400,
                    Detail = "Folder is not present in given drive"
                });
            }

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromBody] FileRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.DeleteFile(session.Username, request.Id); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }

            return Ok();
        }


    }
}
