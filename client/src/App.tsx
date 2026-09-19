import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useNotificationSocket } from "./hooks/useNotificationSocket";


export const App: React.FC = () => {
  useNotificationSocket();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};


export default App;
