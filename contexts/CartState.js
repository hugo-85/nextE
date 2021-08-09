import { createContext, useState } from "react";

export const CartStateContext = createContext();

const CartStateContextProvider = (props) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartStateContext.Provider value={{ cartOpen, setCartOpen }}>
      {props.children}
    </CartStateContext.Provider>
  );
};

export default CartStateContextProvider;
