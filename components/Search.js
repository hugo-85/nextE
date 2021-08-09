import { useLazyQuery } from "@apollo/client";
import { resetIdCounter, useCombobox } from "downshift";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { useRouter } from "next/dist/client/router";
import { makeStyles } from "@material-ui/core";
import { motion } from "framer-motion";

const SEARCH_PRODUCT_QUERY = gql`
  query SEARCH_PRODUCT_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  mainSearch: {
    width: "100%",
    "& input": {
      width: "100%",
      border: "none",
      borderBottom: "1px solid grey",
    },
  },
  dropDown: {
    position: "absolute",
    zIndex: "100",
    width: "100%",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: "#eef1f3",
    marginTop: "10px",
    boxShadow: "0px 8px 4px -1px #000000",
  },
  dropDownItem: {
    backgroundColor: "white",
    width: "100%",
    marginBottom: "10px",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    minHeight: "60px",
    maxHeight: "60px",
    cursor: "pointer",
    "& img": {
      marginRight: "10px",
      maxHeight: "60px",
      objectFit: "contain",
    },
  },
  dropDownItemSelected: {
    backgroundColor: "white",
    width: "100%",
    marginBottom: "10px",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    minHeight: "60px",
    maxHeight: "60px",
    cursor: "pointer",
    marginLeft: "50px",
    "& img": {
      marginRight: "10px",
      maxHeight: "60px",
      objectFit: "contain",
    },
  },
  loading: {
    borderBottom: "1px solid blue !important",
  },
}));

const Search = () => {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCT_QUERY,
    {
      fetchPolicy: "no-cache",
    }
  );
  const classes = useStyles();
  const items = data?.searchTerms || [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      console.log("input Changed", inputValue);
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    itemToString: (item) => item?.name || "",
  });

  const containerVariants = {
    hiddenContainer: {
      opacity: 0,
    },
    visibleContainer: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.5,
      },
    },
  };

  const itemsVariants = {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
    hover: { scale: 1.2, x: 150 },
  };

  return (
    <div className={classes.mainSearch}>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: "search",
            placeholder: "Search for an Item",
            id: "search",
            disabled: loading ? true : false,
            className: loading ? classes.loading : "",
          })}
        />
      </div>
      <motion.div
        variants={containerVariants}
        initial="hiddenContainer"
        animate={items.length > 0 && "visibleContainer"}
        className={classes.dropDown}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <motion.div
              className={
                index === highlightedIndex
                  ? classes.dropDownItemSelected
                  : classes.dropDownItem
              }
              variants={itemsVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              key={item.id}
              {...getItemProps({ item, index })}
              //onClick={() => goToItem(item.id)}
              //highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </motion.div>
          ))}
        {isOpen && items.length === 0 && !loading && (
          <div className={classes.dropDownItem}>
            Sorry, No items found for {inputValue}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
