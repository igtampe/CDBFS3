namespace Igtampe.CDBFS.Api.Requests.Auth {
    public class RegisterRequest : LoginRequest{
        public string RegistrationKey { get; set; } = "";
    }
}
