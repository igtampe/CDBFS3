using Igtampe.CDBFS.Common;
using Igtampe.CDBFS.Data;
using Microsoft.AspNetCore.Mvc;
using static Igtampe.CDBFS.Api.Controllers.AuthController;

namespace Igtampe.CDBFS.Api.Controllers {

    [ApiController]
    [Route("api/access")]
    public class AccessController : ControllerBase {

        readonly CdbfsDAO dao;

        public AccessController() {
            dao = new(new EnvironmentKey("DB_URL", () => throw new InvalidOperationException("")).ToString());
        }


        [HttpGet]
        public async Task<IActionResult> MyAccess() {
            var session = GetSession(Request, Response);
            return Ok(await dao.AccessRecords(session?.Username));
        }

        [HttpGet("{driveId}")]
        public async Task<IActionResult> DriveAccess(int driveId) {
            var session = GetSession(Request, Response);
            return session == null
                ? Unauthorized()
                : Ok(await dao.AccessRecords(session.Username,driveId));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccess([FromBody] AccessRecord record) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.AddAccessRecord(session.Username, record);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAccess([FromBody] AccessRecord record) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.UpdateAccessRecord(session.Username, record.Id, record.Access); ;
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAccess([FromBody]AccessRecord record) {
            var session = GetSession(Request, Response);
            if (session == null) { return Unauthorized(); }

            await dao.DeleteAccessRecord(session.Username, record.Id);
            return Ok();
        }


    }
}
