import React from "react";

import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThirftDataContext, useDataReducer } from "./useData";
import { UiDataContext, useUiReducer } from "./useUiData";

import "./index.css";

const UiDataProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useUiReducer();
  const value = { state, dispatch };
  return <UiDataContext.Provider value={value}>{children}</UiDataContext.Provider>;
};

const DataProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useDataReducer();
  const value = { state, dispatch };
  return <ThirftDataContext.Provider value={value}>{children}</ThirftDataContext.Provider>;
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <DataProvider>
      <UiDataProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </UiDataProvider>
    </DataProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
