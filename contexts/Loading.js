import { createContext, useState } from "react";

export const LoadingContext = createContext();

const LoadingContextProvider = (props) => {
  const [appLoading, setAppLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ appLoading, setAppLoading }}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
