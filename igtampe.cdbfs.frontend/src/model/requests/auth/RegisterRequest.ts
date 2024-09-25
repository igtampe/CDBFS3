import LoginRequest from "./LoginRequest";

export default class RegisterRequest extends LoginRequest{
    public constructor(
        public registrationKey:string,
        username:string,
        password:string
    ){ super(username,password)}
}