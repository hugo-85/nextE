import "../styles/globals.css";
import "../components/styles/nprogress.css";
import { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Page from "../template/Page";
import NProgress from "nprogress";
import Router from "next/router";
import { ApolloProvider } from "@apollo/client";
import withData from "../lib/withData";
import LoadingContextProvider from "../contexts/Loading";
import MessageContextProvider from "../contexts/Message";
import CartStateContextProvider from "../contexts/CartState";
import { ThemeProvider } from "@material-ui/styles";
import { customTheme } from "../template/customTheme";
import { createMuiTheme } from "@material-ui/core";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MainApp = ({ Component, pageProps, apollo }) => {
  const theme = createMuiTheme(customTheme);
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={apollo}>
      <CssBaseline />
      <LoadingContextProvider>
        <MessageContextProvider>
          <CartStateContextProvider>
            <ThemeProvider theme={theme}>
              <Page>
                <Component {...pageProps} />
              </Page>
            </ThemeProvider>
          </CartStateContextProvider>
        </MessageContextProvider>
      </LoadingContextProvider>
    </ApolloProvider>
  );
};

MainApp.getInititalProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInititalProps) {
    pageProps = await Component.getInititalProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MainApp);
