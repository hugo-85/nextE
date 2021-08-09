import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import formatMoney from "../lib/formatMoney";
import Link from "next/link";
import Router from "next/router";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { LoadingContext } from "../contexts/Loading";
import { MessageContext } from "../contexts/Message";
import { useContext, useEffect } from "react";
import { CURRENT_USER_QUERY } from "./User";

const useStyles = makeStyles((theme) => ({
  root: {},
  productDiv: {
    marginTop: "10px",
    marginBottom: "10px",
    minWidth: "250px",
    //width: "280px",
    //height: "370px",
    //background: white;
    //border: 1px solid #333;
    position: "relative",
    zIndex: "90",
  },
  media: {},
  priceTag: {
    backgroundColor: "cornflowerblue",
    transform: "rotate(45deg)",
    position: "absolute",
    right: "15px",
    top: "10px",
    zIndex: "100",
    fontSize: "25px",
    color: "white",
    padding: "5px",
    fontWeight: "900",
  },
  ribbonWrapper: {
    width: "100px",
    height: "90px",
    overflow: "hidden",
    position: "absolute",
    top: "12px",
    right: "12px",
    //left: "3px",
    zIndex: 1,
    "& .ribbon": {
      font: "bold 15px sans-serif",
      color: "#333",
      textAlign: "center",
      "-webkit-transform": "rotate(45deg)",
      "-moz-transform": "rotate(45deg)",
      "-ms-transform": "rotate(45deg)",
      "-o-transform": "rotate(45deg)",
      position: "relative",
      padding: "7px 0",
      top: "15px",
      //left: "30px",
      width: "140px",
      backgroundColor: "#ebb134",
      color: "#fff",
      fontSize: "20px",
      fontWeight: "900",
    },
  },
}));

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

const Product = ({ data, skip, first }) => {
  const classes = useStyles();
  const { setAppLoading } = useContext(LoadingContext);
  const { setAppMessage } = useContext(MessageContext);

  const [deleteProduct, { loading, error }] = useMutation(
    DELETE_PRODUCT_MUTATION
  );

  const [addToCart, { loading: loadingAdd, error: errorAdd }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: {
        id: data.id,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  function updateProducts(cache, payload) {
    console.log("payload", payload);
    cache.evict(cache.identify(payload.data.deleteProduct));
  }

  useEffect(() => {
    setAppLoading(loading);
  }, [loading]);

  const deleteProductHandler = async (id) => {
    const resp = await deleteProduct({
      variables: {
        id,
      },
      update: updateProducts,
    }).catch((err) => {
      setAppMessage({
        message: err.message || "Hubo un problema",
        severity: "error",
      });
    });
  };

  const addProductToCart = async () => {
    setAppLoading(true);
    const resp = await addToCart().catch((err) => {
      setAppLoading(false);
      setAppMessage({
        message: err.message || "Hubo un problema",
        severity: "error",
      });
    });
    setAppLoading(false);
  };

  return (
    <Grid
      item
      xs={12}
      sm={4}
      animate={{ rotate: 360 }}
      component={motion.div}
      className={classes.productDiv}
    >
      <div className={classes.ribbonWrapper}>
        <div class="ribbon">{formatMoney(data.price)}</div>
      </div>
      <Card className={classes.root}>
        <CardActionArea
          onClick={() => {
            Router.push({
              pathname: `/product/${data.id}`,
            });
          }}
        >
          <CardMedia
            className={classes.media}
            component="img"
            height="140"
            src={data.photo.image.publicUrlTransformed}
            alt={data.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {data.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {data.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => addProductToCart()}
          >
            Comprar
          </Button>

          <Link
            href={{
              pathname: `/update`,
              query: {
                id: data.id,
                skip,
                first,
              },
            }}
          >
            <Button size="small" color="primary">
              Editar
            </Button>
          </Link>
          <Button
            size="small"
            color="primary"
            onClick={() => deleteProductHandler(data.id)}
          >
            Borrar
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Product;
