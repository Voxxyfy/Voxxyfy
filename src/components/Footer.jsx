import React from "react";
import styles from "../styles/components/footer.module.scss";
import horizontalLogo from "../assets/images/voxxyfyWhite.svg";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <img src={horizontalLogo} alt="Logo" className={styles.footerLogo}/>
      <a href="https://voxxyfy.com" target="_blank" rel="noreferrer">
        www.voxxyfy.com
      </a>
    </div>
  );
}
