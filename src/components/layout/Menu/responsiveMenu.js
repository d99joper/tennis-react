import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  SwipeableDrawer,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import {
  AiOutlineMenuUnfold,
  AiOutlineMenuFold,
  AiOutlineHome,
  AiOutlineQuestionCircle,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { SlUser } from "react-icons/sl";
import { GiTennisCourt, GiWhistle } from "react-icons/gi";
import { CiMail } from "react-icons/ci";
import NotificationBadge from "./NotificationBadge";
import { AuthContext } from "contexts/AuthContext";
import { MdOutlineEmojiEvents } from "react-icons/md";

const drawerWidthLarge = 240;
const drawerWidthSmall = 60;

const ResponsiveMenu = ({ ...props }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isSmallScreen);
  const [drawerWidth, setDrawerWidth] = useState(drawerWidthLarge);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
    setDrawerWidth((prev) =>
      prev === drawerWidthLarge ? drawerWidthSmall : drawerWidthLarge
    );
  };

  useEffect(() => {
    setDrawerWidth(open ? drawerWidthLarge : drawerWidthSmall);
    const appDiv = document.getElementById("app");
    if (appDiv) {
      if (isSmallScreen)
        appDiv.style.marginLeft = '0px';
      else
        appDiv.style.marginLeft = `${drawerWidth}px`; // Dynamically adjust the margin of the #app container
    }
  }, [drawerWidth, open, isSmallScreen]);

  useEffect(() => {
    // close the menu drawer when moving to a medium screen
    if (isMediumScreen)
      setOpen(false)
  }, [isMediumScreen])

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/login?redirectTo=${location.pathname}`);
  };

  const handleLogout = () => {
    logout();
    // authAPI.signOut();
    // navigate(location.pathname);
  };

  const MenuContent = () => (
    <List>
      <ListItemButton title="Home" component={Link} to="/">
        <ListItemIcon>
          <AiOutlineHome size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Home" : ""} />
      </ListItemButton>
      {isLoggedIn && (
        <React.Fragment>
          <ListItemButton title="My Profile" component={Link} to={"/players/" + props.currentUser?.id}>
            <ListItemIcon>

              <SlUser size="1.5rem" />
            </ListItemIcon>
            <ListItemText primary={open ? "My Profile" : ""} />
          </ListItemButton>
          <ListItemButton title="Messages" component={Link} to="/notifications">
            <ListItemIcon>
              <NotificationBadge>
                <CiMail size="1.5rem" />
              </NotificationBadge>
              {/* <Badge
                badgeContent={notificationCount}
                color="error"
                showZero={false}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <CiMail size="1.5rem" />
              </Badge> */}
            </ListItemIcon>
            <ListItemText primary={open ? "Messages" : ""} />
          </ListItemButton>
        </React.Fragment>
      )}
      <ListItemButton title="Players" component={Link} to="/players">
        <ListItemIcon>
          <SlUser size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Players" : ""} />
      </ListItemButton>
      <ListItemButton title="Clubs" component={Link} to="/clubs">
        <ListItemIcon>
          <AiOutlineUsergroupAdd size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Clubs" : ""} />
      </ListItemButton>
      <ListItemButton title="Events" component={Link} to="/events">
        <ListItemIcon>
          <MdOutlineEmojiEvents size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Events" : ""} />
      </ListItemButton>
      <ListItemButton title="Courts" component={Link} to="/courts">
        <ListItemIcon>
          <GiTennisCourt size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Courts" : ""} />
      </ListItemButton>
      {/* <ListItemButton title="Search" component={Link} to="/search">
        <ListItemIcon>
          <BsSearch size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Search" : ""} />
      </ListItemButton> */}
      <ListItemButton title="FAQ" component={Link} to="/faq">
        <ListItemIcon>
          <AiOutlineQuestionCircle size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "FAQ" : ""} />
      </ListItemButton>
      <ListItemButton title="Rules" component={Link} to="/rules">
        <ListItemIcon>
          <GiWhistle size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Rules" : ""} />
      </ListItemButton>
      <ListItemButton title="About" component={Link} to="/about">
        <ListItemIcon>
          <AiOutlineInfoCircle size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "About" : ""} />
      </ListItemButton>
      {!isLoggedIn ? (
        <ListItemButton title="Login" component={Link} to="/login" onClick={handleLogin}>
          <ListItemIcon>
            <BiLogInCircle size="1.5rem" />
          </ListItemIcon>
          <ListItemText primary={open ? "Login" : ""} />
        </ListItemButton>
      ) : (
        <ListItemButton title="Logout" onClick={handleLogout}>
          <ListItemIcon>
            <BiLogOutCircle size="1.5rem" />
          </ListItemIcon>
          <ListItemText primary={open ? "Logout" : ""} />
        </ListItemButton>
      )}
      {user?.isAdmin && (
        <ListItemButton title="Admin" component={Link} to="/adminTasks">
          <ListItemIcon>
            <AiOutlineSetting size="1.5rem" />
          </ListItemIcon>
          <ListItemText primary={open ? "Admin" : ""} />
        </ListItemButton>
      )}
    </List>
  );

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "transparent" }}>
      <Toolbar className='banner'>
        <div className="banner-title">
          <h1>My Tennis Space</h1>
        </div>
        {isSmallScreen ? (
          <IconButton
            edge="end"
            onClick={() => setOpen((prev) => !prev)}
            className="drawer-puller"
          >
            <NotificationBadge >
              <AiOutlineMenuUnfold color="white" size="1.5rem" />
            </NotificationBadge>
          </IconButton>
        ) : (
          <Drawer
            variant="permanent"
            open={open}
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": { width: drawerWidth, backgroundColor: theme.palette.background.header },
            }}
          >
            <div
              onClick={handleDrawerToggle}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "8px",
              }}
            >
              <IconButton>
                {open ? <AiOutlineMenuFold size="1.5rem" /> : <AiOutlineMenuUnfold size="1.5rem" />}
              </IconButton>
            </div>
            <Divider />
            <MenuContent />
          </Drawer>
        )}
        {isSmallScreen && (
          <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
          >
            <MenuContent />
          </SwipeableDrawer>
        )}
        <div className='banner-settings'>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <Link className='bannerLink' to={'/search'}>
              <BsSearch
                title="Search"
                size={'1.5rem'}
                className="cursorHand"
              />
              {/* <small> Search</small> */}
            </Link>
            {isLoggedIn ?
              <Box>
                {!isSmallScreen &&
                  <span>
                    <Link to={`/players/${props.currentUser?.id}`} className='bannerLink'>
                      <NotificationBadge>
                        <SlUser size={'1.5rem'} />
                      </NotificationBadge>
                      {/* <UserInitialsIcon user={props.currentUser} notificationCount={notificationCount} /> */}
                    </Link>
                  </span>
                }
                {/* <Link className='bannerLink' onClick={handleLogout}>
                  <BiLogOutCircle
                    title="Logout"
                    size={'1.5rem'}
                    className="cursorHand"
                  />
                  <small> logout</small>
                </Link> */}
              </Box>
              : <></>
              // <Link to="/login" className='bannerLink' onClick={handleLogin}>
              //   <BiLogInCircle
              //     title="Login"
              //     size={'1.5rem'}
              //     className="cursorHand"
              //     component="Link"
              //     to="/login"
              //   />
              //   <small> login</small>
              // </Link>
            }
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveMenu;
