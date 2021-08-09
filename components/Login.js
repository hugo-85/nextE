import { useState, useContext } from "react";
import Router from "next/router";
import {
  Container,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Button,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import EmailIcon from "@material-ui/icons/Email";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";
import { LoadingContext } from "../contexts/Loading";
import { MessageContext } from "../contexts/Message";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
        code
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  main: {
    padding: "20px",
    maxWidth: "700px",
    marginLeft: "10%",
    "& h3": {
      backgroundColor: "#7381de",
      color: "white",
      fontWeight: "900",
      borderRadius: "2px",
      padding: "7px",
      fontSize: "25px",
      margin: "0px",
      marginBottom: "20px",
    },
    "& .loginButton": {
      color: "white",
      backgroundColor: "#7281de",
      fontWeight: "900",
      marginTop: "10px",
    },
  },
}));

function Login() {
  const { setAppLoading } = useContext(LoadingContext);
  const { setAppMessage } = useContext(MessageContext);
  const [showPass, setShowPass] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [signin, { data, loading, error }] = useMutation(SIGNIN_MUTATION, {
    variables: values,
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY,
      },
    ],
  });

  const classes = useStyles();

  const handleChange = (event) => {
    let { name, value } = event.target;

    setValues({ ...values, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAppLoading(true);
    const resp = await signin();
    setAppLoading(false);
    console.log("resp", resp);

    /*const error =
      resp?.data?.authenticateUserWithPassword.__typename ===
      "UserAuthenticationWithPasswordFailure"
        ? data?.authenticateUserWithPassword
        : undefined;*/

    const error =
      resp?.data?.authenticateUserWithPassword.code === "FAILURE"
        ? true
        : false;

    console.log("error", error);

    if (error)
      setAppMessage({
        message: "El email no existe o el password es incorrecto!",
        severity: "error",
      });
    else
      Router.push({
        pathname: `/`,
      });
  };

  return (
    <Container>
      <Paper elevation={3} className={classes.main}>
        <h3>Log In!</h3>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            id="email"
            name="email"
            type="email"
            required
            fullWidth
            className={classes.defaultInput}
            value={values.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl className={classes.inputPass} fullWidth>
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="password"
              name="password"
              required
              type={showPass ? "text" : "password"}
              fullWidth
              value={values.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            size="large"
            className="loginButton"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
