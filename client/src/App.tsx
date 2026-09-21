import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "./routes/AppRoutes";
import { useNotificationSocket } from "./hooks/useNotificationSocket";

export const App: React.FC = () => {
  useNotificationSocket();

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" closeButton />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
