import React, { useEffect, useState } from "react";
import styles from "../styles/translatebutton.module.scss";
import { motion } from "motion/react";
import {
  replaceTelegramMsgText,
  replaceTwitterMsgText,
} from "../libs/domHandler";
import { replaceWhatsAppMsgText } from "../libs/whatsapp";

const platforms = {
  TELEGRAM: "TELEGRAM",
  TWITTER: "TWITTER",
  WHATSAPP: "WHATSAPP",
};

export default function TranslateButton({ msgElem }) {
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("TELEGRAM");

  const handleClick = async () => {
    try {
      const msgHTML = msgElem.innerHTML;
      const payload = {
        action: "GET_TRANSLATION",
        text: msgHTML,
        detectLang: true,
      };

      msgElem.classList.add("blur");
      setLoading(true);

      const response = await chrome.runtime.sendMessage(payload);
      setLoading(false);
      msgElem.classList.remove("blur");

      if (!response || response?.message) return;
      switch (platform) {
        case platforms.TELEGRAM:
          replaceTelegramMsgText({ response, msgElem });
          break;
        case platforms.TWITTER:
          replaceTwitterMsgText({ response, msgElem });
          break;
        case platforms.WHATSAPP:
          replaceWhatsAppMsgText({ response, msgElem });
          break;
        default:
          break;
      }

      // msgElem.innerHTML = translation;
    } catch (error) {
      console.log(error);
      setLoading(false);
      msgElem.classList.remove("blur");
    }
  };

  useEffect(() => {
    const url = window.location.href;
    if (url.includes("web.telegram.org")) {
      setPlatform("TELEGRAM");
    } else if (url.includes("x.com")) {
      setPlatform("TWITTER");
    } else if (url.includes("whatsapp.com")) {
      setPlatform("WHATSAPP");
    }
  }, []);

  return (
    <div className={styles.translateButtonContainer}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className={styles.buttonWrapper}
      >
        <button className={styles.translateButton} onClick={handleClick}>
          <img
            src={chrome.runtime.getURL("assets/icons/64.png")}
            alt=""
            className={styles.buttonIcon}
          />
          {loading ? "translating..." : "translate"}
        </button>
      </motion.div>
    </div>
  );
}
