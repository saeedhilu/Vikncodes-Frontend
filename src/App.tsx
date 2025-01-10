import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductsList from "./pages/ProductsList";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store/Store";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/erroboundary/ErrorBoundary";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Toaster richColors position="bottom-center" />
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product" element={<ProductsList />} />
              </Routes>
            </Router>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
