import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer, List } from "@material-ui/core";
import { CartStateContext } from "../contexts/CartState";
import useUser from "./User";
import CartItem from "./CartItem";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "300px",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
    "& .cartTitle": {
      backgroundColor: "tomato",
      textAlign: "center",
      color: "white",
      fontSize: "30px",
      fontWeight: "900",
    },
  },
}));

function Cart() {
  const classes = useStyles();
  const { cartOpen, setCartOpen } = useContext(CartStateContext);
  const me = useUser();

  //console.log("me", me);

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

    setCartOpen(open);
  };

  if (!me) return null;

  return (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={(e) => toggleDrawer(e, false)}
      style={{ zIndex: 900 }}
    >
      <div
        className={classes.root}
        role="presentation"
        //onClick={(e) => toggleDrawer(e, false)}
        //onKeyDown={(e) => toggleDrawer(e, false)}
      >
        <div className="cartTitle">Carrito</div>
        <List>
          {me.cart.map((ci) => (
            <CartItem key={ci.id} item={ci} />
          ))}
        </List>
      </div>
    </Drawer>
  );
}

export default Cart;
