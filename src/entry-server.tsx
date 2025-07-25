import ReactDOMServer from "react-dom/server";
import React from "react";
import App from "./App";

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  return { html };
}
