import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TransactionsProvider } from "./components/context/TransactionContext";

ReactDOM.render(
  <TransactionsProvider>
    <App />
  </TransactionsProvider>,
  document.getElementById("root")
);
