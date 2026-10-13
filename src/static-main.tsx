import React from "react";
import { createRoot } from "react-dom/client";
import StaticGame from "./static-app";
import "./styles.css";
createRoot(document.getElementById("root")!).render(<React.StrictMode><StaticGame /></React.StrictMode>);
