import { useContext } from "react";
import {
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  IconButton,
} from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { makeStyles } from "@material-ui/core/styles";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";
import { LoadingContext } from "../contexts/Loading";

const useStyles = makeStyles((theme) => ({
  inline: {
    display: "inline",
  },
  item: {
    "& .MuiListItemText-primary": {
      display: "flex",
    },
    "& .deleteButton": {
      marginLeft: "auto",
      padding: "0px",
    },
  },
}));

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function CartItem({ item }) {
  const classes = useStyles();
  const { setAppLoading } = useContext(LoadingContext);

  const [deleteCartItem, { loading, error }] = useMutation(
    DELETE_ITEM_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const deleteItem = async (id) => {
    setAppLoading(true);
    const resp = await deleteCartItem({
      variables: {
        id,
      },
    });
    setAppLoading(false);
  };

  return (
    <>
      <ListItem alignItems="flex-start" className={classes.item}>
        <ListItemAvatar>
          <Avatar
            alt="Ball"
            src={item.product.photo.image.publicUrlTransformed}
          />
        </ListItemAvatar>

        <ListItemText
          primary={
            <>
              {item.product.name}
              <IconButton
                className="deleteButton"
                onClick={() => deleteItem(item.id)}
              >
                <HighlightOffIcon />
              </IconButton>
            </>
          }
          secondary={
            <>
              {`  ${item.quantity} x ${formatMoney(
                item.product.price
              )} -> ${formatMoney(item.quantity * item.product.price)}`}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

export default CartItem;
