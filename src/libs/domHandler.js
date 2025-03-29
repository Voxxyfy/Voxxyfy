import React from "react";
import { createRoot } from "react-dom/client";
import TranslateButton from "../components/TranslateButton";
import styles from "../styles/translatebutton.module.scss";

const getTextInputPositionTelegram = (element) => {
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
    let allMsgBalloons = document.querySelectorAll("div[data-message-id]");
    const midMsgBalloons = document.querySelectorAll('div[data-mid]')
    const allMsgBalloonsArray = [...allMsgBalloons, ...midMsgBalloons];

    allMsgBalloonsArray.forEach((balloon) => {
      const isButtonExist = balloon.querySelector("#voxxyfy-translate-button");
      const own = balloon.classList.contains("own") || balloon.classList.contains("is-out");
      const msgElem = balloon.querySelector(".text-content") || balloon.querySelector(".translatable-message");

      if (isButtonExist || own || !msgElem) return;

      const translateBtnContainer = document.createElement("div");
      const msgContentElm = balloon.querySelector(".message-content-wrapper") || balloon.querySelector(".bubble-content-wrapper");
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
    const target = event.target;
    if (target.getAttribute("data-testid") !== "dmComposerTextInput") return;
    const editor = document.querySelector('[data-testid="dmComposerTextInput"]');
    if (!editor) return;

    if (!event.isTrusted) return;

    if (event.key === "Backspace") {
      const currentText = editor.textContent;
      if (currentText && currentText.length > 0) {
        event.preventDefault();
        const newText = currentText.slice(0, -1);
        replaceDraftJsText(newText);
      }
    }
  };

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
    const textToInsert = newText.length > 0 ? newText : ' ';
    document.execCommand("insertText", false, textToInsert);

    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      data: newText,
      inputType: "insertText",
    });
    editor.dispatchEvent(inputEvent);
  }, 15);
};

const replaceTweetPostText = (newText) => {
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

const replaceTweetText = (newText) => {
  const editor = document.querySelector('[data-testid="tweetTextarea_0"]');

  if (!editor) return;
  editor.focus();

  document.execCommand("selectAll", false, null);
  document.execCommand("delete");

  setTimeout(() => {
    const textToInsert = newText.length > 0 ? newText : ' ';
    document.execCommand("insertText", false, textToInsert);

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
    const target = event.target;
    if (target.getAttribute("data-testid") !== "tweetTextarea_0") return;
    const editor = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!editor) return;

    // Only handle real keyboard events
    if (!event.isTrusted) return;

    if (event.key === "Backspace") {
      const currentText = editor.textContent;
      if (currentText && currentText.length > 0) {
        event.preventDefault();
        const newText = currentText.slice(0, -1);
        replaceTweetText(newText);
      }
    }
  };

  document.removeEventListener("keydown", handleEvent);
  document.addEventListener("keydown", handleEvent);
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

  // Store any existing child elements that we want to preserve
  const existingElements = Array.from(msgElem.children).filter(child =>
    !child.classList.contains('text-content') &&
    child.id !== 'translation'
  );

  // Create a wrapper for the translated text
  const translationWrapper = document.createElement('span');
  translationWrapper.classList.add('text-content');
  translationWrapper.textContent = translation;

  // Clear the message element
  msgElem.innerHTML = '';

  // Add back the translation
  msgElem.appendChild(translationWrapper);

  // Restore preserved elements
  existingElements.forEach(element => {
    msgElem.appendChild(element);
  });
};

export {
  getTextInputPositionTelegram,
  addListener,
  addMessageTranslateButtons,
  replaceDraftJsText,
  addBackspaceListener,
  addTweetBackspaceListener,
  replaceTweetText,
  replaceTelegramMsgText,
  replaceTwitterMsgText,
  replaceTweetPostText
};
