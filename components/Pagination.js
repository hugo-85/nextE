import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Head from "next/head";
import Link from "next/link";
import DisplayError from "./ErrorMessage";
//import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";
import { makeStyles, Paper } from "@material-ui/core";
import ForwardIcon from "@material-ui/icons/Forward";

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

const Pagination = ({ page }) => {
  const { data, loading, error } = useQuery(PAGINATION_QUERY);

  const { count } = data ? data?._allProductsMeta : 0;
  const pageCount = Math.ceil(count / perPage);

  const useStyles = makeStyles((theme) => ({
    pagDiv: {
      display: "flex",
      width: "fit-content",
      margin: "0 auto",
      "& div.desc": {
        display: "flex",
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        "& p": { marginTop: "0px" },
      },
      "& .backDiv": {
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        marginRight: "20px",
        "& svg": {
          transform: "rotate(180deg)",
          fontSize: "30px",
          color: page <= 1 ? "#cccccc" : "#617a90",
        },
      },
      "& .nextDiv": {
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        marginLeft: "20px",
        "& svg": {
          fontSize: "30px",
          color: page === pageCount ? "#cccccc" : "#617a90",
        },
      },
      "& .dividerLeft": {
        width: "20px",
        boxShadow:
          "inset 10px 0px 10px -13px rgb(0 0 0 / 50%), inset -10px 0px 10px -13px rgb(250 250 250)",
        transform: "skewX(20deg)",
      },
      "& .dividerRight": {
        width: "20px",
        boxShadow:
          "inset 10px 0px 10px -13px rgb(250 250 250), inset -10px 0px 10px -13px rgb(0 0 0 / 50%)",
        transform: "skewX(-20deg)",
      },
    },
  }));

  let classes = useStyles();

  if (loading)
    return (
      <Paper className={classes.pagDiv}>
        <Head>
          <title>Bambino</title>
        </Head>

        <div className="backDiv">
          <ForwardIcon />
        </div>

        <div className="dividerLeft">{""}</div>
        <div className="desc">
          <p>Pagina 0 de 0</p>
        </div>
        <div className="dividerRight">{""}</div>

        <div className="nextDiv">
          <ForwardIcon />
        </div>
      </Paper>
    );

  if (error) return <DisplayError error={error} />;

  return (
    <Paper className={classes.pagDiv}>
      <Head>
        <title>
          Bambino | Pagina {page} de {pageCount}
        </title>
      </Head>

      {page <= 1 ? (
        <div className="backDiv">
          <ForwardIcon />
        </div>
      ) : (
        <Link href={`/products/${page - 1}`}>
          <a className="backDiv">
            <ForwardIcon />
          </a>
        </Link>
      )}

      <div className="dividerLeft">{""}</div>
      <div className="desc">
        <p>
          Pagina {page} de {pageCount}
        </p>
      </div>
      <div className="dividerRight">{""}</div>

      {page === pageCount ? (
        <div className="nextDiv">
          <ForwardIcon />
        </div>
      ) : (
        <Link href={`/products/${page + 1}`}>
          <a className="nextDiv">
            <ForwardIcon />
          </a>
        </Link>
      )}
    </Paper>
  );
};

export default Pagination;
