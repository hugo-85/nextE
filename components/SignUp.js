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

const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $name: String!) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
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

function SignUp() {
  const { setAppLoading } = useContext(LoadingContext);
  const { setAppMessage } = useContext(MessageContext);
  const [showPass, setShowPass] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signup, { error, loading }] = useMutation(SIGNUP_MUTATION, {
    variables: values,
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

  const handleSingUp = async (e) => {
    e.preventDefault();
    if (values.password.length < 8) {
      setAppMessage({
        message: "The password should be at least 8 caracters long!",
        severity: "error",
      });
      return;
    }
    setAppLoading(true);
    const resp = await signup().catch((err) => {
      setAppMessage({
        message: "The email already exists",
        severity: "error",
      });
      setAppLoading(false);
    });
    setAppLoading(false);
    console.log("resp", resp);
  };

  return (
    <Container>
      <Paper elevation={3} className={classes.main}>
        <h3>Sign Up!</h3>
        <form onSubmit={handleSingUp}>
          <TextField
            label="Name"
            id="name"
            name="name"
            type="text"
            required
            fullWidth
            className={classes.defaultInput}
            value={values.name}
            onChange={handleChange}
          />
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

export default SignUp;
