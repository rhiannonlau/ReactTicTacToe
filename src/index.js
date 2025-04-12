import React, { StrictMode } from "react"; // react
import { createRoot } from "react-dom/client"; // react library to talk to web browsers (react DOM)
import "./styles.css";

import App from "./App"; // the component from App.js

// connects the component from App.js to the web browser
// "injects" the final product into index.html
const root = createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);