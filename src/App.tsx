import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider } from "./context/ClientContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Reports } from "./pages/Reports";
import { Meetings } from "./pages/Meetings";
import { Links } from "./pages/Links";
import { Invoices } from "./pages/Invoices";
import { RequestUpdate } from "./pages/RequestUpdate";

function App() {
  return (
    <BrowserRouter>
      <ClientProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/links" element={<Links />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/request" element={<RequestUpdate />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </ClientProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-4xl mb-3">404</p>
      <p className="text-zinc-400 text-sm">Page not found.</p>
    </div>
  );
}

export default App;
