import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();
function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/Register"
            element={<Register />}
          />
        </Routes>

        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
        />
      </QueryClientProvider>
    </div>
  );
}

export default App;
