import React, { useState, useEffect } from "react";
import styles from "../styles/components/tweettranslatebutton.module.scss";
import { getFromStorage } from "../controllers/storageController";
import {
  addListener,
  replaceTweetText,
  addTweetBackspaceListener,
} from "../libs/domHandler";

export default function TweetTranslateBtn() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toLanguage, setToLanguage] = useState({
    label: "FR 🇩🇪",
    value: "fr",
  });

  const handleTranslate = async () => {
    addTweetBackspaceListener() //add listener again to make sure it's working
    let tweetInput = document.querySelector(
      'div[data-testid="tweetTextarea_0"]'
    );
    tweetInput.style.transition = "filter 0.5s";
    tweetInput.style.filter = "blur(3px)";

    try {
      setLoading(true);
      const messagePayload = {
        action: "GET_TRANSLATION",
        text: inputText,
        reverse: true,
        detectLang: true,
      };
      const response = await chrome.runtime.sendMessage(messagePayload);
      if (!response || response?.message) return;
      replaceTweetText(response.translation);
      tweetInput.style.filter = "none";

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Text translation failed", error);
    }
  };

  const addListenerToTweetInput = () => {
    const handleInput = async (e) => {
      setInputText(e.target.textContent);
    };

    const timer = setInterval(() => {
      const tweetInput = document.querySelector(
        'div[data-testid="tweetTextarea_0"]'
      );
      if (!tweetInput) return;

      clearInterval(timer);
      addListener(tweetInput, "keyup", handleInput);
    }, 300);
  };

  useEffect(() => {
    (async () => {
      const { settings } = await getFromStorage("settings");
      if (settings?.translateTo) setToLanguage(settings?.translateTo);
    })();

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== "local") return;
      if (changes.settings) {
        setToLanguage(changes.settings.newValue?.translateTo);
      }
    });

    addListenerToTweetInput();
  }, []);

  return (
    <button
      className={styles.button}
      disabled={inputText.length === 0}
      onClick={handleTranslate}
    >
      <img
        src={chrome.runtime.getURL("assets/images/32.png")}
        alt=""
        className={styles.voxxyfyLogo}
      />
      {loading
        ? "Translating..."
        : `Translate to ${toLanguage.label}`}
      {!loading && <img src={toLanguage.flag} className={styles.flag} />}
    </button>
  );
}
