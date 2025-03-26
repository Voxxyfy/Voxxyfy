import React from "react";
import { createRoot } from "react-dom/client";
import TranslateButton from "../components/TranslateButton";
import styles from "../styles/translatebutton.module.scss";

const getWhatsAppInputPosition = (element) => {
  const { left, top } = element.getBoundingClientRect();
  return {
    x: left + window.scrollX,
    y: top + window.scrollY - element.offsetHeight - 50,
  };
};

const addListener = (element, event, handler) => {
  element.addEventListener(event, handler);

  return () => {
    element.removeEventListener(event, handler);
  };
};

const addWhatsappTranslateButtons = () => {
  setInterval(() => {
    const allMsgBalloons = document.querySelectorAll("div.message-in");

    allMsgBalloons.forEach((balloon) => {
      const isButtonExist = balloon.querySelector("#voxxyfy-translate-button");
      const msgElem = balloon.querySelector(".copyable-text");

      if (isButtonExist || !msgElem) return;

      const translateBtnContainer = document.createElement("div");
      const msgContentElm = balloon;
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

const replaceWhatsAppMsgText = ({ response, msgElem }) => {
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

  const colorElem = document.querySelector(".message-in")?.querySelector('._amk6')
  const bgColor = window.getComputedStyle(colorElem)?.backgroundColor;

  trnsltCont.style.backgroundColor = bgColor;
  trnsltCont.innerHTML = doc.body.innerHTML;
  msgElem.appendChild(trnsltCont);
};

function clearAndReplaceText(inputElement, newText) {
  inputElement.focus();

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const selectAllEvent = new KeyboardEvent("keydown", {
    key: "a",
    code: "KeyA",
    keyCode: 65,
    bubbles: true,
    [isMac ? "metaKey" : "ctrlKey"]: true
  });
  inputElement.dispatchEvent(selectAllEvent);

  const backspaceEvent = new KeyboardEvent("keydown", {
    key: "Backspace",
    code: "Backspace",
    keyCode: 8,
    bubbles: true
  });
  inputElement.dispatchEvent(backspaceEvent);

  document.execCommand("insertText", false, newText);

  inputElement.dispatchEvent(new InputEvent("input", { bubbles: true }));
}


export {
  getWhatsAppInputPosition,
  addListener,
  addWhatsappTranslateButtons,
  replaceWhatsAppMsgText,
  clearAndReplaceText
};
