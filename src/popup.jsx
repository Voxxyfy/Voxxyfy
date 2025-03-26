import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  getFromStorage,
} from "./controllers/storageController.js";
import { createRoot } from "react-dom/client";

import Login from "./screens/Login.jsx";
import Dashboard from "./screens/Dashboard.jsx";

function Popup() {
  const [userData, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { user } = await getFromStorage("user");
      if (!user) return;

      setUser(user);
    })();
  }, [getFromStorage]);

  return (
    <div className="container">
      {!userData && <Login setUser={setUser} />}
      {userData && <Dashboard userData={userData} />}
    </div>
  );
}

const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);
