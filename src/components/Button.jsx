import React from "react";
import styles from "../styles/components/button.module.scss";
import loadingIcon from "../assets/images/loading.svg";

export default function Button({ text, onClick, loading }) {
  return (
    <div className={styles.buttonWrapper}>
      <button className={styles.button} onClick={onClick} disabled={loading}>
        {loading ? <img src={loadingIcon} className={styles.loadingIcon}/> : text}
      </button>
    </div>
  );
}
