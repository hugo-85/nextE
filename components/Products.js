import { useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import gql from "graphql-tag";
import { perPage } from "../config";
import Product from "./Product";

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $first: Int) {
    allProducts(skip: $skip, first: $first) {
      id
      name
      description
      price
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const Products = ({ page }) => {
  const { loading, error, data } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      skip: page * perPage - perPage,
      first: perPage,
    },
  });
  if (loading) return <div>Loading....</div>;

  //console.log("Products", data);
  return (
    <Grid container spacing={3}>
      {data?.allProducts.map((p) => (
        <Product
          key={p.id}
          data={p}
          skip={page * perPage - perPage}
          first={perPage}
        />
      ))}
    </Grid>
  );
};

export default Products;
