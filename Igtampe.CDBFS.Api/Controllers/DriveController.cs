using Igtampe.CDBFS.Api.Requests;
using Igtampe.CDBFS.Data;
using Microsoft.AspNetCore.Mvc;
using static Igtampe.CDBFS.Api.Controllers.AuthController;

namespace Igtampe.CDBFS.Api.Controllers {


    [ApiController]
    [Route("api/drives")]
    public class DriveController : ControllerBase{

        readonly CdbfsDAO dao;

        public DriveController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }

        [HttpGet]
        public async Task<IActionResult> Drives() {
            var session = GetSession(Request, Response);
            return Ok(await dao.Drives(session?.Username));
        }

        [HttpPut("format")]
        public async Task<IActionResult> Format([FromBody] DriveRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.Format(session.Username, request.Id);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateDrive([FromBody] DriveRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.CreateDrive(session.Username, request.Name);

            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> RenameDrive([FromBody] DriveRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.RenameDrive(session.Username,request.Id, request.Name);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDrive([FromBody] DriveRequest request) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.DeleteDrive(session.Username, request.Id);

            return Ok();
        }

    }
}
