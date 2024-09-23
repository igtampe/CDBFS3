using Igtampe.CDBFS.Api.Requests;
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
            return Ok(await dao.Dir(session?.Username, drive, null));
        }

        [HttpGet("dir/{drive}/{folder}")]
        public async Task<IActionResult> Dir(int drive, int folder) {
            var session = GetSession(Request, Response);
            return Ok(await dao.Dir(session?.Username, drive, folder));
        }

        [HttpPost]
        public async Task<IActionResult> CreateFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.CreateFolder(session.Username, request.Drive, request.ParentFolder, request.Name);

            return Created();
        }

        [HttpPost("copy")]
        public async Task<IActionResult> CopyFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.CopyFolder(session.Username, request.Id, request.Drive, request.ParentFolder);

            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> RenameFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.RenameFolder(session.Username, request.Id, request.Name);

            return Ok();

        }


        [HttpPut("move")]
        public async Task<IActionResult> MoveFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.MoveFolder(session.Username, request.Id, request.Drive, request.ParentFolder);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFolder([FromBody] FolderRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.DeleteFolder(session.Username, request.Id);

            return Ok();
        }

    }
}
