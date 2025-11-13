
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
// Suppress console errors
const originalError = console.error;
console.error = (...args) => {
  // Only show critical errors
  const errorString = args.join(' ');
  if (errorString.includes('Warning:') ||
    errorString.includes('The above error occurred') ||
    errorString.includes('Consider adding an error boundary')) {
    return;
  }
  originalError.apply(console, args);
};