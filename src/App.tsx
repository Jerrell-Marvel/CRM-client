import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Customer from "./pages/Customer";
import EditCustomer from "./pages/EditCustomer";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();
function App() {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />
      <div className="max-w-3xl bg-slate-200 mx-auto">
        <div className="px-4">
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
                path="/register"
                element={<Register />}
              />
              <Route
                path="/customer/:id"
                element={<Customer />}
              />

              <Route
                path="/edit-customer/:id"
                element={<EditCustomer />}
              />
            </Routes>

            <ReactQueryDevtools
              initialIsOpen={false}
              position="bottom-left"
            />
          </QueryClientProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
