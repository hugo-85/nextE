import { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Router from "next/router";
import Link from "next/link";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
//import NotificationsIcon from "@material-ui/icons/Notifications";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";
import Logo from "../template/Logo";
import { CartStateContext } from "../contexts/CartState";
import useUser, { CURRENT_USER_QUERY } from "./User";
import { LoadingContext } from "../contexts/Loading";

const SIGNOUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  logo: {
    "& svg": { maxHeight: "60px", width: "auto", marginRight: "5px" },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "flex",
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    /*[theme.breakpoints.up("sm")]: {
      display: "none",
    },*/
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    paddingLeft: "0px",
    "& li": {
      display: "flex",
    },
    "& a": {
      padding: "1rem 1rem",
      display: "flex",
      alignItems: "center",
      position: "relative",
      textTransform: "uppercase",
      fontWeight: 500,
      background: "none",
      border: 0,
      cursor: "pointer",
      textDecoration: "none",
      paddingTop: "0px",
      paddingBottom: "0px",
      fontSize: "1.7rem",
    },
    "& div": {
      width: "4px",
      backgroundColor: "white",
      content: " ",
      height: "100%",
      transform: "skew(-5deg)",
    },
  },
}));

const Nav = () => {
  const { setAppLoading } = useContext(LoadingContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuProfileOpen = Boolean(anchorEl);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setCartOpen } = useContext(CartStateContext);
  const me = useUser();
  //const [cantCartItems, setCantCartItems] = useState(0);
  var cantCartItems =
    me && me?.cart
      ? me.cart.reduce(
          (prev, act) =>
            (prev?.quantity ? prev?.quantity : prev) + act?.quantity || 0
        )
      : [];

  const [signout, { loading: loadingOut }] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY,
      },
    ],
  });

  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  /*useEffect(() => {
    console.log("M E", me);
    if (me && me.cart.length > 0) {
      const cant = me.cart.reduce((prev, act) => {
        return (prev?.quantity ? prev?.quantity : prev) + act?.quantity || 0;
      });
      setCantCartItems(cant);
    }
  }, [me]);*/

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (event, open) => {
    console.log("open", open);
    console.log("event", event.type, event.key);
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsMenuOpen(open);
  };

  const handleLoginOption = () => {
    setAnchorEl(null);
    Router.push({
      pathname: `/login`,
    });
  };

  const handleLogoutOption = async () => {
    setAnchorEl(null);
    setAppLoading(true);
    await signout();
    setAppLoading(false);
  };

  const handleSigUpOption = () => {
    setAnchorEl(null);
    Router.push({
      pathname: `/signup`,
    });
  };

  const menuId = "primary-search-account-menu";
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuProfileOpen}
      onClose={handleProfileMenuClose}
    >
      {me && (
        <div>
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutOption}>Log Out</MenuItem>{" "}
        </div>
      )}
      {!me && (
        <div>
          <MenuItem onClick={handleSigUpOption}>Sign Up</MenuItem>
          <MenuItem onClick={handleLoginOption}>Log In</MenuItem>
        </div>
      )}
    </Menu>
  );
  console.log("M E 2", me);
  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{ zIndex: 800 }}>
        <Toolbar>
          {windowSize.width < 600 && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <div className={classes.logo}>
            <Logo />
          </div>
          <Typography className={classes.title} variant="h6" noWrap>
            B A M B I N O
          </Typography>
          {/*<div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>*/}
          {windowSize.width > 600 && (
            <div className={classes.grow}>
              <ul className={classes.navLinks}>
                <li>
                  <Link href="/products">Products</Link>
                  {me && <div></div>}
                </li>
                {me && (
                  <>
                    <li>
                      <Link href="/sell">Sell</Link>
                      <div></div>
                    </li>
                    <li>
                      <Link href="/orders">Orders</Link>
                      <div></div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
          <div className={classes.sectionDesktop}>
            {me && (
              <IconButton
                aria-label={`${cantCartItems} items`}
                color="inherit"
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={cantCartItems} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {profileMenu}

      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={(e) => toggleDrawer(e, false)}
      >
        <div
          className={classes.drawerMenu}
          role="presentation"
          onClick={(e) => toggleDrawer(e, false)}
          onKeyDown={(e) => toggleDrawer(e, false)}
        >
          <List>
            <ListItem button>
              <ListItemIcon>
                {" "}
                <CardGiftcardIcon />
              </ListItemIcon>
              <ListItemText primary={"Productos"} />
            </ListItem>
            {me && (
              <>
                <ListItem button>
                  <ListItemIcon>
                    {" "}
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Sell"} />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    {" "}
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Orders"} />
                </ListItem>
              </>
            )}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Nav;
