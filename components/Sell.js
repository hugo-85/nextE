import { useCallback, useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, makeStyles, TextField } from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { useDropzone } from "react-dropzone";
import NumberFormat from "react-number-format";
import { LoadingContext } from "../contexts/Loading";
import { MessageContext } from "../contexts/Message";
import { ALL_PRODUCTS_QUERY } from "./Products";
import { PAGINATION_QUERY } from "./Pagination";

const CREATE_PRUDUCT_MUTATION = gql`
  mutation CREATE_PRUDUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload!
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      name
      description
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  title: {
    color: "#9597b7",
    backgroundColor: "#ffffff",
    textAlign: "center",
    border: "3px solid #eee",
    borderRadius: "7px",
  },
  root: {
    border: "none",
    "& > div": {
      marginTop: "10px",
    },
  },
  /////
  uploader: {
    display: "block",
    clear: "both",
    margin: "0 auto",
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    background: "#fff",
    borderRadius: "7px",
    border: "3px solid #eee",
    transition: "all .2s ease",
    userSelect: "none",
    "&:hover": {
      border: "3px solid rgb(112 125 204)",
    },
    "& svg": {
      width: "100%",
      height: "40px",
    },
    "& .preview": {
      padding: "20px",
      width: "100%",
      objectFit: "contain",
      maxWidth: "300px",
    },
  },
  UploadButton: {
    display: "inline-block",
    margin: ".5rem .5rem 1rem .5rem",
    clear: "both",
    fontFamily: "inherit",
    fontWeight: "700",
    fontSize: "14px",
    textDecoration: "none",
    textTransform: "initial",
    border: "none",
    borderRadius: ".2rem",
    outline: "none",
    padding: "0 1rem",
    height: "36px",
    lineHeight: "36px",
    color: "#fff",
    transition: "all 0.2s ease-in-out",
    boxSizing: "border-box",
    background: "#454cad",
    borderColor: "#454cad",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(112 125 204)",
    },
  },
  sellButton: {
    color: "#3f50b5",
    float: "right",
    fontWeight: 700,
  },

  ////
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
      decimalScale="2"
      fixedDecimalScale="true"
    />
  );
}

const Sell = () => {
  const { setAppLoading } = useContext(LoadingContext);
  const { setAppMessage } = useContext(MessageContext);
  const [values, setValues] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [file, setFile] = useState(null);

  const classes = useStyles();
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRUDUCT_MUTATION,
    {
      variables: values,
      refetchQueries: [
        { query: ALL_PRODUCTS_QUERY },
        { query: PAGINATION_QUERY },
      ],
    }
  );

  useEffect(() => {
    setAppLoading(loading);
  }, [loading]);

  const handleChange = (event) => {
    let { value, name, type } = event.target;
    if (type === "number") value = parseInt(value);

    if (type === "file") [value] = event.target.files;

    setValues({ ...values, [name]: value });
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles);

    const fileTemp = acceptedFiles[0];

    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      console.log(binaryStr);
      var arrayBufferView = new Uint8Array(binaryStr);
      var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);

      setFile(imageUrl);
      setValues({ ...values, image: fileTemp });
    };
    reader.readAsArrayBuffer(fileTemp);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

    //setAppLoading(true);
    if (!file) {
      setAppMessage({
        message: "Debe ingresar una imagen para el producto!",
        severity: "error",
      });
      return;
    }
    const resp = await createProduct({
      variables: {
        ...values,
        price: parseFloat(values.price) * 100,
      },
    }).catch((err) => {
      //setAppLoading(false);
      setAppMessage({
        message: error.message || "Hubo un problema",
        severity: "error",
      });
    });

    //setAppLoading(false);
    setAppMessage({ message: "Producto creado!", severity: "success" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={classes.title}>Vende un nuevo producto!</h2>
      <fieldset disabled={loading} aria-busy={loading} className={classes.root}>
        <div {...getRootProps()} className={classes.uploader}>
          <input {...getInputProps()} />

          {file && <img src={file} alt="Preview" className="preview" />}

          <ImageSearchIcon />

          <Button
            variant="outlined"
            size="medium"
            className={classes.UploadButton}
          >
            Selecciona una imagen o arrastrala hasta aqui!
          </Button>
        </div>

        <TextField
          id="name"
          name="name"
          label="Nombre"
          fullWidth
          required
          onChange={handleChange}
        />
        <TextField
          id="description"
          name="description"
          label="Descripcion"
          fullWidth
          required
          onChange={handleChange}
        />

        <TextField
          label="Precio"
          value={values.price}
          onChange={handleChange}
          name="price"
          required
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </fieldset>

      <Button
        type="submit"
        size="large"
        variant="outlined"
        className={classes.sellButton}
      >
        Vender
      </Button>
    </form>
  );
};

export default Sell;
