import React, { useEffect, useState } from "react";
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
  Badge,
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
} from "react-icons/ai";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { SlUser } from "react-icons/sl";
import { GiWhistle } from "react-icons/gi";
import authAPI from "api/auth";
import UserInitialsIcon from "./usersInitialsIcon";
import notificationAPI from "api/services/notifications";

const drawerWidthLarge = 240;
const drawerWidthSmall = 60;

const ResponsiveMenu = (props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isSmallScreen);
  const [notificationCount, setNotificationCount] = useState(0);
  const [drawerWidth, setDrawerWidth] = useState(drawerWidthLarge);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
    setDrawerWidth((prev) =>
      prev === drawerWidthLarge ? drawerWidthSmall : drawerWidthLarge
    );
  };

  useEffect(() => {
    // Fetch notification count on mount
    async function fetchNotifications() {
      try {
        const count = await notificationAPI.getUnreadCount();
        setNotificationCount(count || 0);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    }
    fetchNotifications();
  }, []);

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

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/login?redirectTo=${location.pathname}`);
  };

  const handleLogout = () => {
    authAPI.signOut();
    navigate(location.pathname);
  };

  const MenuContent = () => (
    <List>
      <ListItemButton title="Home" component={Link} to="/">
        <ListItemIcon>
          <AiOutlineHome size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Home" : ""} />
      </ListItemButton>
      {props.isLoggedIn && (
        <ListItemButton title="My Profile" component={Link} to="/profile">
          <ListItemIcon>
            <Badge
              badgeContent={notificationCount}
              color="error"
              showZero={false}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <SlUser size="1.5rem" />
            </Badge>
          </ListItemIcon>
          <ListItemText primary={open ? "My Profile" : ""} />
        </ListItemButton>
      )}
      <ListItemButton title="Search" component={Link} to="/search">
        <ListItemIcon>
          <BsSearch size="1.5rem" />
        </ListItemIcon>
        <ListItemText primary={open ? "Search" : ""} />
      </ListItemButton>
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
      {!props.isLoggedIn ? (
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
      {props.currentUser?.isAdmin && (
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
            <AiOutlineMenuUnfold color="white" size="1.5rem" />
          </IconButton>
        ) : (
          <Drawer
            variant="permanent"
            open={open}
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": { width: drawerWidth },
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
          {props.isLoggedIn === true ?
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
              {!isSmallScreen &&
                <span>
                  <Link to={`/profile/${props.currentUser?.id}`} className='bannerLink'>
                    <UserInitialsIcon user={props.currentUser} notificationCount={notificationCount} />
                  </Link>
                </span>
              }
              <Link className='bannerLink' onClick={handleLogout}>
                <BiLogOutCircle
                  title="Logout"
                  size={'1.5rem'}
                  className="cursorHand"
                />
                <small> logout</small>
              </Link>
            </Box>
            :
            <Link to="/login" className='bannerLink' onClick={handleLogin}>
              <BiLogInCircle
                title="Login"
                size={'1.5rem'}
                className="cursorHand"
                component="Link"
                to="/login"
              />
              <small> login</small>
            </Link>
          }
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveMenu;
