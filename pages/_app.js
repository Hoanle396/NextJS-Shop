import "tailwindcss/tailwind.css";
import "../styles/global.css";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { store } from "../app/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
const queryClientOption = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: 1000 * 5 },
  },
};

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(new QueryClient(queryClientOption));
  return (
    <AnimatePresence>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </QueryClientProvider>
      <Toaster />
    </AnimatePresence>
  );
}

export default MyApp;
