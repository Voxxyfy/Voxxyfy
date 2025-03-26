import React, { useState } from "react";
import styles from "../styles/screens/login.module.scss";
import logo from "../assets/images/vwhite.svg";
import voxxyfy from "../assets/images/voxxyfyWhite.svg";

import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { WEB_APP_URL } from "../config";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Email and password are required");
      }

      if (!emailRegex.test(email)) {
        setError("Invalid email address");
        return;
      }

      setLoading(true);
      const response = await chrome.runtime.sendMessage({
        action: "LOGIN",
        data: { email, password },
      });

      if (!response) {
        setError("Invalid email or password");
      }

      setLoading(false);
      setUser(response);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setError(null);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setError(null);
    setPassword(e.target.value);
  };

  const handleRegisterButton = () =>{
    chrome.tabs.create({ url: WEB_APP_URL+"/register" });
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" className={styles.logo} />
        <img src={voxxyfy} alt="logo" className={styles.logoHorizontal} /> 
      </div>
      <div className={styles.inputContainer}>
        <TextInput
          type="email"
          placeholder="email address"
          onChange={handleEmailChange}
          disabled={loading}
        />
        <TextInput
          type="password"
          placeholder="password"
          onChange={handlePasswordChange}
          disabled={loading}
        />
        <span className={styles.error}>{error}</span>
      </div>
      <div className={styles.buttonContainer}>
        <Button text="Log in" onClick={handleLogin} loading={loading} />
      </div>
      <div className={styles.footer}>
        <span className={styles.label}>New to Voxxyfy?</span>
        <a href="#" className={styles.link} onClick={handleRegisterButton}>
          Register
        </a>
      </div>
    </div>
  );
}
