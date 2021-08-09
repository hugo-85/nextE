import { useQuery } from "@apollo/client";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      description
      price
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  imageWrapper: {
    border: "2px solid",
    borderRadius: "10px",
  },
  image: {
    width: "100%",
    objectFit: "contain",
    maxHeight: "300px",
  },
}));

const SingleProduct = ({ id }) => {
  const { loading, error, data } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  });
  const classes = useStyles();

  if (loading) return <div>Loading......</div>;
  const { Product: product } = data;
  console.log(product);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} className={classes.imageWrapper}>
        <img
          src={product.photo.image.publicUrlTransformed}
          alt={product.name}
          className={classes.image}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom variant="h3" component="h2">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h4" component="h2">
          {formatMoney(product.price)}
        </Typography>
        <Typography gutterBottom variant="h5" component="h4">
          {product.description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" size="large" color="primary">
          Comprar
        </Button>
      </Grid>
    </Grid>
  );
};

export default SingleProduct;
