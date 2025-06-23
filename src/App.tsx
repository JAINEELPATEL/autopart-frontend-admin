import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Toaster } from "../components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        {/* <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sellers" element={<Sellers />} />
              <Route path="/buyers" element={<Buyers />} />
              <Route path="/enquiries" element={<Enquiries />} />
              <Route path="/quotations" element={<Quotations />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/tickets" element={<Tickets />} />
            </Routes>
          </main>
        </div> */}
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
