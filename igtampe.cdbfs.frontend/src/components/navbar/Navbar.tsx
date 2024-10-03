import { AppBar, Avatar, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip } from "@mui/material"
import { useUser } from "../hooks/useUser";
import { logout } from "../../api/Auth";
import useApi from "../hooks/useApi";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { useSnackbar } from "notistack";
import AboutModal from "./subcomponents/AboutModal";
import AuthModal from "./subcomponents/AuthModal";
import ChangePassModal from "./subcomponents/ChangePassModal";

export default function Navbar() {

    const [aboutOpen, setAboutOpen] = useState(false)

    return <>
        <AppBar color={"default"} enableColorOnDark>
            <Toolbar>
                <div style={{ display: "flex", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ flex: "1" }}>
                        <Button onClick={() => setAboutOpen(true)}>
                            <img src={"/header.png"} alt="CDBFS Logo" height="25" />
                        </Button>
                    </div>
                    <div>
                        <UserButton />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
        <AboutModal open={aboutOpen} setOpen={setAboutOpen} />
    </>
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