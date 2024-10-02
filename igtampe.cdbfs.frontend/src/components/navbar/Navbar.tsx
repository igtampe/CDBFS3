import { AppBar, Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, Link, Menu, MenuItem, TextField, Toolbar, Tooltip } from "@mui/material"
import { useUser } from "../hooks/useUser";
import { changePassword, login, logout, register } from "../../api/Auth";
import useApi from "../hooks/useApi";
import { useEffect, useState } from "react";
import ApiAlert from "../shared/ApiAlert";
import RegisterRequest from "../../model/requests/auth/RegisterRequest";
import LoginRequest from "../../model/requests/auth/LoginRequest";
import ChangePassRequest from "../../model/requests/auth/ChangePassRequest";
import { useTheme } from "@emotion/react";
import { useSnackbar } from "notistack";

export default function Navbar() {
    return <AppBar color={"default"} enableColorOnDark>
        <Toolbar>
            <div style={{ display: "flex", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
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

    const theme = useTheme() as any;
    const { user, loading, refreshAuth } = useUser();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [changePassModalOpen, setChangePassModalOpen] = useState(false)
    const [profileMenuEl, setProfileMenuEl] = useState(false as any);
    const { enqueueSnackbar } = useSnackbar();

    const logoutApi = useApi(logout);

    if (loading) return <></>

    const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setProfileMenuEl(e.currentTarget);
    };

    const handleLogout = () => {
        logoutApi.fetch(() => {
            enqueueSnackbar("Logged out!", { variant: "success" })
            refreshAuth();
        });
        handleCloseProfileMenu();
    }

    const handleChangePass = () => {
        setChangePassModalOpen(true)
        handleCloseProfileMenu()
    }

    const handleCloseProfileMenu = () => {
        setProfileMenuEl(null);
    };

    return <>
        {user
            ? <>
                <Tooltip title={user.username}>
                    <IconButton
                        onClick={handleProfileClick}
                        size="small"
                        sx={{ ml: 2 }}
                    >
                        <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>{user.username.charAt(0)}</Avatar>
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={profileMenuEl} open={!!profileMenuEl} onClose={handleCloseProfileMenu}>
                    <MenuItem onClick={handleChangePass}>Change Password</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </>
            : <>
                <Button variant="outlined" onClick={() => setAuthModalOpen(true)}>Log In</Button>
            </>
        }

        <ChangePassModal open={changePassModalOpen} setOpen={setChangePassModalOpen} />
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

function ChangePassModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props
    const { refreshAuth } = useUser();
    const { enqueueSnackbar } = useSnackbar();
    const changePassApi = useApi(changePassword);

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        setNewPassword("")
        setPassword("")
    }, [open])

    const handleClick = () => {
        changePassApi.fetch(onSuccess, undefined, {
            newPassword: newPassword,
            oldPassword: password
        } as ChangePassRequest)
    }

    const onSuccess = () => {
        setOpen(false);
        enqueueSnackbar("Password changed!", { variant: "success" })
        refreshAuth();
    }



    return <Dialog open={open} maxWidth={"xs"} fullWidth onClose={() => setOpen(false)}>
        <DialogContent>
            <ApiAlert result={changePassApi.error} style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex" }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="icon.png" width={64} />
                </div>
                <hr style={{ margin: "0 20px" }} />
                <div style={{ flex: 1 }}>
                    <div>
                        <TextField
                            fullWidth placeholder="Current Password" variant="standard" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <TextField
                            fullWidth placeholder="New Password" variant="standard" type="password"
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </DialogContent>
        <DialogActions>
            {
                (changePassApi.loading)
                    ? <CircularProgress size={25} />
                    : <Button onClick={handleClick}>Change Password</Button>
            }

        </DialogActions>
    </Dialog>

}