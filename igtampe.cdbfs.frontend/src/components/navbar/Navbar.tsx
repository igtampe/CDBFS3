import { Alert, AppBar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, Link, Paper, Tab, Tabs, TextField, Toolbar } from "@mui/material"
import { useUser } from "../hooks/useUser";
import { login, logout, register } from "../../api/Auth";
import useApi from "../hooks/useApi";
import { useEffect, useState } from "react";

export default function Navbar() {
    return <AppBar color={"default"} enableColorOnDark>
        <Toolbar>
            <div style={{ display: "flex", width: "100%" }}>
                <div style={{ flex: "1" }}>
                    <a href="/">
                        <img src={"/header.png"} alt="CDBFS Logo" height="25" />
                    </a>
                </div>
                <div>
                    <UserButton />
                </div>
            </div>
        </Toolbar>
    </AppBar>
}

function UserButton() {

    const { user, loading } = useUser();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    if (loading) return <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div><CircularProgress size={25} /></div>
            <div style={{ marginLeft: "20px" }}>Spinning up</div>
        </div>
    </>

    return <>

        {user
            ? <>
                <Button variant="outlined">Log In</Button>
            </>
            : <>
                <Button variant="outlined" onClick={() => setAuthModalOpen(true)}>Log In</Button>
            </>
        }

        <AuthModal open={authModalOpen} setOpen={setAuthModalOpen} />
    </>

}

function AuthModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props
    const { refreshAuth } = useUser();
    const loginApi = useApi(login);
    const registerApi = useApi(register)

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

    return <Dialog open={open} maxWidth={"xs"} fullWidth onClose={() => setOpen(false)}>
        <DialogContent>
            <div style={{ marginBottom: "20px" }}><Alert severity="error" >asdf</Alert></div>
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
            <Button>{!registerMode ? "Log in" : "Register"}</Button>
        </DialogActions>
    </Dialog>

}