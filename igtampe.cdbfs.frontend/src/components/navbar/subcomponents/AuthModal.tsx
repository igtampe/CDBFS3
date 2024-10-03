import { useSnackbar } from "notistack";
import useApi from "../../hooks/useApi";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import RegisterRequest from "../../../model/requests/auth/RegisterRequest";
import LoginRequest from "../../../model/requests/auth/LoginRequest";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Link, TextField } from "@mui/material";
import ApiAlert from "../../shared/ApiAlert";
import { login, register } from "../../../api/Auth";

export default function AuthModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props
    const { refreshAuth } = useUser();
    const loginApi = useApi(login);
    const registerApi = useApi(register)

    const { enqueueSnackbar } = useSnackbar();

    const [registerMode, setRegisterMode] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [regKey, setRegKey] = useState("")

    useEffect(() => {
        setUsername("")
        setPassword("")
        setRegKey("")
        setRegisterMode(false)
    }, [open])

    const handleClick = () => {
        if (registerMode) {
            registerApi.fetch(onRegisterSuccess, undefined, {
                username: username,
                password: password,
                registrationKey: regKey
            } as RegisterRequest)
        } else {
            loginApi.fetch(onLoginSuccess, undefined, {
                username: username,
                password: password
            } as LoginRequest)
        }
    }

    const onRegisterSuccess = () => {
        loginApi.fetch(onLoginSuccess, undefined, {
            username: username,
            password: password
        } as LoginRequest)
    }

    const onLoginSuccess = () => {
        enqueueSnackbar("Logged in!", { variant: "success" })
        refreshAuth();
        setOpen(false);
    }


    return <Dialog open={open} maxWidth={"xs"} fullWidth onClose={() => setOpen(false)}>
        <DialogContent>
            <ApiAlert result={registerMode ? registerApi.error : loginApi.error} style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex" }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="icon.png" width={64} />
                </div>
                <hr style={{ margin: "0 20px" }} />
                <div style={{ flex: 1 }}>
                    <div>
                        <TextField
                            fullWidth placeholder="Username" variant="standard"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <TextField
                            fullWidth placeholder="Password" variant="standard" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {registerMode && <div style={{ marginTop: "10px" }}>
                        <TextField
                            fullWidth placeholder="Registration key" variant="standard" type="password"
                            value={regKey} onChange={(e) => setRegKey(e.target.value)}
                        />
                    </div>}
                    <div style={{ color: "lightGray", fontSize: ".75em", marginTop: "20px" }}> {
                        registerMode ? "Already" : "Don't"
                    } have an account? <Link onClick={() => setRegisterMode(!registerMode)}>{registerMode ? "Log in" : "Register"}</Link></div>
                </div>
            </div>
        </DialogContent>
        <DialogActions>
            {
                (loginApi.loading || registerApi.loading)
                    ? <CircularProgress size={25} />
                    : <Button onClick={handleClick}>{!registerMode ? "Log in" : "Register"}</Button>
            }

        </DialogActions>
    </Dialog>

}
