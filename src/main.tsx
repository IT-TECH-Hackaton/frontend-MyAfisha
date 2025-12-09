import { createRoot } from "react-dom/client";

import { Providers } from "@app/providers";

import "./assets/index.css";

createRoot(document.getElementById("root")!).render(<Providers />);
