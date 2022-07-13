import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { NextPageWithLayout } from "../types";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistStore } from "redux-persist";
import store from "../store/store";
import { ModalProvider } from "@/components/modal-views/context";
import { Toaster } from "react-hot-toast";
import ModalsContainer from "@/components/modal-views/container";
import { AnimatePresence } from "framer-motion";
import CustomRouter from "./_router";

import "@/assets/css/scrollbar.css";
import "@/assets/css/swiper-carousel.css";
import "@/assets/css/globals.css";
import "@/assets/css/table.css";

let persistor = persistStore(store);

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <ModalProvider>
            <AnimatePresence
              exitBeforeEnter
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              <>
                <CustomRouter Component={Component} pageProps={pageProps} />
                <ModalsContainer />
                <Toaster containerClassName="!top-16 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
              </>
            </AnimatePresence>
          </ModalProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
