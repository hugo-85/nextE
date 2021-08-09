import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useContext } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "./Header";
import { LoadingContext } from "../contexts/Loading";
import { MessageContext } from "../contexts/Message";
import useUser from "../components/User";
import Router from "next/router";
import Login from "../components/Login";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    maxWidth: "var(--maxWidth)",
    margin: "0 auto",
    padding: "2rem",
  },
  backdrop: {
    zIndex: 1000,
    color: "#fff",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Page = ({ children }) => {
  const classes = useStyles();
  const me = useUser();
  const { appLoading } = useContext(LoadingContext);
  const { appMessage, setAppMessage } = useContext(MessageContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAppMessage({ ...appMessage, message: "" });
  };
  console.log(Router?.router?.pathname);
  const availablePaths = ["/", "/products"];
  return (
    <div>
      <Header />
      <Backdrop className={classes.backdrop} open={appLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={!!appMessage.message}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert onClose={handleClose} severity={appMessage.severity}>
          {appMessage.message}
        </Alert>
      </Snackbar>
      <main className={classes.mainContainer}>
        {me ? (
          children
        ) : availablePaths.includes(Router?.router?.pathname) ? (
          children
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
};

export default Page;
