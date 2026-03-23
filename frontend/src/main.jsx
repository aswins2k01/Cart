import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import store from "./store.jsx";
import { BrowserRouter } from "react-router-dom";
// console.log("Current Redux State:", store.getState());
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,

  //</StrictMode>,
);
