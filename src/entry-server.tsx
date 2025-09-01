import ReactDOMServer from "react-dom/server";
import React from "react";
import App from "./App";

// !Use renderToString for server-side rendering
export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  return { html };
}
