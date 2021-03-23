import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom-theme.scss";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { RecoilRoot } from "recoil";
import { recoilPersist } from "recoil-persist";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { SmoothProvider } from "react-smooth-scrolling";

const { RecoilPersist, updateState } = recoilPersist([], {
  key: "data",
  storage: localStorage,
});

ReactDOM.render(
  <Router>
    <RecoilRoot initializeState={updateState}>
      <SmoothProvider skew={true} ease={0.06}>
        <App />
      </SmoothProvider>
      <RecoilPersist />
    </RecoilRoot>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
