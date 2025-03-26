import React from "react";
import styles from "../styles/components/textInput.module.scss";

import emailIcon from "../assets/images/emailIcon.svg";
import passwordIcon from "../assets/images/passwordIcon.svg";

export default function TextInput({
  type,
  placeholder,
  defaultValue,
  onChange,
  ...props
}) {
  return (
    <div className={styles.textInputContainer}>
      <img
        src={type === "email" ? emailIcon : passwordIcon}
        alt="icon"
        className={styles.icon}
      />
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className={styles.textInput}
        {...props}
      />
    </div>
  );
}
