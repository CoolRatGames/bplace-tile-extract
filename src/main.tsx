import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement: HTMLElement | null = document.getElementById("root");
if(!rootElement) throw Error("HTML Root Element for React not found.");

const reactRoot = createRoot(rootElement);
reactRoot.render(
	<StrictMode>
		<App/>
	</StrictMode>
);
