import { useState, useEffect } from "react";
import { API_BASE } from "./Path";
import axios from "axios";

function UseAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkLogin();
  });

  async function checkLogin() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        logout();
        return;
      }
      const response = await axios.get(`${API_BASE}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = await response.data;
        localStorage.setItem("user_data", JSON.stringify(data));
        // navigate("/profile", { replace: true });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Sign error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      setIsAuthenticated(false);
    }
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
  }

  return { isAuthenticated };
}

export default UseAuth;
