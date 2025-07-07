import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import App from "./App.tsx";
import "./index.css";

// Render the app without BrowserRouter (now in App.tsx)
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
  </React.StrictMode>
);