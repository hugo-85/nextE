import { createContext, useState } from "react";

export const MessageContext = createContext();

const MessageContextProvider = (props) => {
  const [appMessage, setAppMessage] = useState({
    message: "",
    severity: "",
    //error, warning, info, success
  });

  return (
    <MessageContext.Provider value={{ appMessage, setAppMessage }}>
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
