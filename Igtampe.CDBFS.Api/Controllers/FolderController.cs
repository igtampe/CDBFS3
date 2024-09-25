using Igtampe.CDBFS.Api.Requests;
using Igtampe.CDBFS.Common.Exceptions;
using Igtampe.CDBFS.Data;
using Microsoft.AspNetCore.Mvc;
using static Igtampe.CDBFS.Api.Controllers.AuthController;

namespace Igtampe.CDBFS.Api.Controllers {
    [ApiController]
    [Route("api/folder")]
    public class FolderController : ControllerBase {

        readonly CdbfsDAO dao;

        public FolderController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        [HttpGet("dir/{drive}")]
        public async Task<IActionResult> Dir(int drive) {
            var session = GetSession(Request, Response);
            try { return Ok(await dao.Dir(session?.Username, drive, null)); }
            catch (CdbfsFileNotFoundException) { return NotFound(); }
            catch (CdbfsFolderNotInDriveException) { return BadRequest(new ProblemDetails() { 
                Status=400,
                Detail="Folder is not present in given drive"
            }); }
        }

        [HttpGet("dir/{drive}/{folder}")]
        public async Task<IActionResult> Dir(int drive, int folder) {
            var session = GetSession(Request, Response);
            try { return Ok(await dao.Dir(session?.Username, drive, folder)); }
            catch (CdbfsFileNotFoundException) { return NotFound(); }
            catch (CdbfsFolderNotInDriveException) {
                return BadRequest(new ProblemDetails() {
                    Status = 400,
                    Detail = "Folder is not present in given drive"
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.CreateFolder(session.Username, request.Drive, request.ParentFolder, request.Name); }
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

        [HttpPost("copy")]
        public async Task<IActionResult> CopyFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.CopyFolder(session.Username, request.Id, request.Drive, request.ParentFolder); }
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
        public async Task<IActionResult> RenameFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.RenameFolder(session.Username, request.Id, request.Name); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }

            return Ok();

        }


        [HttpPut("move")]
        public async Task<IActionResult> MoveFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.MoveFolder(session.Username, request.Id, request.Drive, request.ParentFolder); }
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
        public async Task<IActionResult> DeleteFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            try { await dao.DeleteFolder(session.Username, request.Id); }
            catch (CdbfsNotAuthorizedException) { return Forbid(); }

            return Ok();
        }

    }
}
