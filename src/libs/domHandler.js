import React from "react";
import { createRoot } from "react-dom/client";
import TranslateButton from "../components/TranslateButton";
import styles from "../styles/translatebutton.module.scss";

const getTextInputPosition = (element) => {
  const { left, top } = element.getBoundingClientRect();
  return {
    x: left + window.scrollX,
    y: top + window.scrollY - element.offsetHeight,
  };
};

const addListener = (element, event, handler) => {
  element.addEventListener(event, handler);

  return () => {
    element.removeEventListener(event, handler);
  };
};

const addMessageTranslateButtons = () => {
  setInterval(() => {
    const allMsgBalloons = document.querySelectorAll("div[data-message-id]");

    allMsgBalloons.forEach((balloon) => {
      const isButtonExist = balloon.querySelector("#voxxyfy-translate-button");
      const own = balloon.classList.contains("own");
      const msgElem = balloon.querySelector(".text-content");

      if (isButtonExist || own || !msgElem) return;

      const translateBtnContainer = document.createElement("div");
      const msgContentElm = balloon.querySelector(".message-content-wrapper");
      if (!msgContentElm) return;
      translateBtnContainer.id = "voxxyfy-translate-button";

      msgContentElm.insertBefore(
        translateBtnContainer,
        msgContentElm.firstChild
      );
      balloon.style.position = "relative";

      const root = createRoot(
        balloon.querySelector("#voxxyfy-translate-button")
      );
      root.render(<TranslateButton msgElem={msgElem} />);
    });
  }, 300);
};

const addBackspaceListener = () => {
  const handleEvent = (event) => {
    const editor = document.querySelector(
      '[data-testid="dmComposerTextInput"]'
    );
    if (!editor) return;

    if (event.key === "Backspace") {
      event.preventDefault();

      let currentText = editor.textContent.trim();

      if (currentText.length > 0) {
        let newText = currentText.slice(0, -1);
        replaceDraftJsText(newText);
      }
    }
  };

  //remove listener if already added
  document.removeEventListener("keydown", handleEvent);
  document.addEventListener("keydown", handleEvent);
};

const replaceDraftJsText = (newText) => {
  const editor = document.querySelector('[data-testid="dmComposerTextInput"]');

  if (!editor) return;
  editor.focus();

  document.execCommand("selectAll", false, null);
  document.execCommand("delete");

  setTimeout(() => {
    document.execCommand("insertText", false, newText);

    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      data: newText,
      inputType: "insertText",
    });
    editor.dispatchEvent(inputEvent);
  }, 10);
};

const addTweetBackspaceListener = () => {
  const handleEvent = (event) => {
    const editor = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!editor) return;

    if (event.key === "Backspace") {
      event.preventDefault();

      let currentText = editor.textContent.trim();

      if (currentText.length > 0) {
        let newText = currentText.slice(0, -1);
        replaceTweetText(newText);
      }
    }
  };
  document.removeEventListener("keydown", handleEvent);
  document.addEventListener("keydown", handleEvent);
};

const replaceTweetText = (newText) => {
  const editor = document.querySelector('[data-testid="tweetTextarea_0"]');

  if (!editor) return;
  editor.focus();

  document.execCommand("selectAll", false, null);
  document.execCommand("delete");

  setTimeout(() => {
    document.execCommand("insertText", false, newText);

    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      data: newText,
      inputType: "insertText",
    });
    editor.dispatchEvent(inputEvent);
  }, 10);
};

const replaceTelegramMsgText = ({ response, msgElem }) => {
  if (!msgElem || !response) return;
  msgElem.style.position = "relative";
  const trnsltCont = document.createElement("div");
  const translation = response.translation;

  trnsltCont.id = "translation";
  trnsltCont.classList.add(styles.telegramTranslation);
  const parser = new DOMParser();
  const doc = parser.parseFromString(translation, "text/html");
  const reactionsElem = doc.querySelector(".Reactions");
  if (reactionsElem) {
    reactionsElem.remove();
  }

  const leftHeader = document.querySelector(".left-header");
  const bgColor = window.getComputedStyle(leftHeader).backgroundColor;

  trnsltCont.style.backgroundColor = bgColor;
  trnsltCont.innerHTML = doc.body.innerHTML;
  msgElem.appendChild(trnsltCont);
};

const replaceTwitterMsgText = ({ response, msgElem }) => {
  if (!msgElem || !response) return;
  const translation = response.translation;
  msgElem.innerHTML = translation;
};

export {
  getTextInputPosition,
  addListener,
  addMessageTranslateButtons,
  replaceDraftJsText,
  addBackspaceListener,
  addTweetBackspaceListener,
  replaceTweetText,
  replaceTelegramMsgText,
  replaceTwitterMsgText,
};
