import { makeStyles } from "@material-ui/core/styles";
import Cart from "../components/Cart";
import Nav from "../components/Nav";
import Search from "../components/Search";

const useStyles = makeStyles((theme) => ({
  header: {},
}));

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <Nav />
      <Search />
      <Cart />
    </div>
  );
};

export default Header;
