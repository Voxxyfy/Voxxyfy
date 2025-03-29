import React, { useRef, useEffect, useState } from "react";
import TranslateBox from "./components/TranslateBox";
import TweetTranslateBtn from "./components/TweetTranslateBtn";
import { createRoot } from "react-dom/client";
import {
  addListener,
  getTextInputPositionTelegram,
  addMessageTranslateButtons,
  addBackspaceListener,
  addTweetBackspaceListener,
  replaceDraftJsText,
} from "./libs/domHandler";
import {
  addMessageTranslateButtonsTwitter,
  getTextInputPositionTwitter,
} from "./libs/twitter";
import {
  addWhatsappTranslateButtons,
  getWhatsAppInputPosition,
  clearAndReplaceText,
} from "./libs/whatsapp";
import { usePlatform, useInputElement } from "./hooks/usePlatform";
import { useSettings, useUser } from "./hooks/useStorage";
import urls from "./constants/urls.json";

const App = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messageText, setMessageText] = useState("");
  const { isTwitter, isWhatsapp, isTelegram } = usePlatform();
  const { value: user } = useUser();
  const { value: settings } = useSettings();

  const inputRef = useRef(null);
  const twitterTimerRef = useRef(null);

  const inputElement = useInputElement({ isTwitter, isWhatsapp, isTelegram });
  if (inputElement) {
    inputRef.current = inputElement;
  }

  const handleTwitterText = (translation) => {
    if (!inputRef.current) return;

    replaceDraftJsText(translation);
    setTimeout(() => setMessageText(""), 100);

    if (settings?.autoSend) {
      const sendBtn = document.querySelector(
        'button[data-testid="dmComposerSendButton"]'
      );
      setTimeout(() => sendBtn?.click(), 300);
    }
  };

  const handleWhatsappText = (translation) => {
    if (!inputRef.current) return;

    clearAndReplaceText(inputRef.current, translation);
    setMessageText("");

    if (settings?.autoSend) {
      setTimeout(() => {
        const main = document.querySelector("#main");
        const sendButton = main?.querySelector('span[data-icon="send"]');
        sendButton?.click();
      }, 500);
    }
  };

  const handleTelegramText = (translation) => {
    if (!inputRef.current) return;

    const event = new Event("input", { bubbles: true });
    inputRef.current.textContent = translation;
    inputRef.current.dispatchEvent(event);
    setTimeout(() => {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",
      });
      if (settings?.autoSend) {
        inputRef.current.dispatchEvent(enterEvent);
      }
      setMessageText("");
    }, 100);
  };

  const addTweetButton = () => {
    if (twitterTimerRef.current) {
      clearInterval(twitterTimerRef.current);
    }

    twitterTimerRef.current = setInterval(() => {
      const existingButton = document.querySelector(
        "#voxxyfy-translate-button-root"
      );
      if (existingButton) return;

      const postButton = document.querySelector(
        'button[data-testid="tweetButtonInline"]'
      );
      if (!postButton) return;

      const rootElem = document.createElement("div");
      rootElem.id = "voxxyfy-translate-button-root";
      postButton.parentElement?.insertBefore(rootElem, postButton);

      const root = createRoot(rootElem);
      root.render(<TweetTranslateBtn />);
    }, 300);
  };

  const handleClose = () => {
    setMessageText("");
  };

  useEffect(() => {
    if (!user) return;
    const hostname = window.location.hostname;
    const type = urls.find((item) => item.url === hostname)?.type;

    if (!type) return;

    if (type === "TWITTER") {
      addTweetButton();
      addMessageTranslateButtonsTwitter();
      addBackspaceListener();
      addTweetBackspaceListener();
    } else if (type === "TELEGRAM") {
      addMessageTranslateButtons();
    } else if (type === "WHATSAPP") {
      addWhatsappTranslateButtons();
    }
  }, [isTwitter, isTelegram, isWhatsapp, user]);

  //WHATSAPP
  useEffect(() => {
    if (!isWhatsapp) return;

    const observeDMActivity = () => {
      const targetNode = document.querySelector("#main");
      if (!targetNode) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const inputElement = targetNode.querySelector(
              'div[contenteditable="true"]'
            );
            if (!inputElement) return;

            inputRef.current = inputElement;
            const initialPosition = getWhatsAppInputPosition(inputElement);
            addListener(inputElement, "input", ({ target }) => {
              setMessageText(target.textContent);
            });
            setPosition(initialPosition);
          }
        });
      });

      observer.observe(targetNode, { childList: true, subtree: true });

      return () => observer.disconnect();
    };

    const observerTimer = setInterval(() => {
      if (document.querySelector("#main")) {
        observeDMActivity();
      }
    }, 500);

    return () => clearInterval(observerTimer);
  }, [isWhatsapp]);

  //TELEGRAM
  useEffect(() => {
    if (!isTelegram) return;

    const observeDMActivity = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const inputElement = document.querySelector(
              "#editable-message-text"
            ) || document.querySelector('.input-message-input');
            if (!inputElement) return;

            inputRef.current = inputElement;
            const initialPosition = getTextInputPositionTelegram(inputElement);
            addListener(inputElement, "input", ({ target }) => {
              setMessageText(target.textContent);
            });
            setPosition(initialPosition);
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    };

    const observerTimer = setInterval(() => {
      if (document.body) {
        observeDMActivity();
      }
    }, 500);

    return () => clearInterval(observerTimer);
  }, [isTelegram]);

  //TWITTER
  useEffect(() => {
    if (!isTwitter) return;

    const observeDMActivity = () => {
      const targetNode = document.querySelector(
        'div[data-testid="DmActivityViewport"]'
      );
      if (!targetNode) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const inputElement = document.querySelector(
              'div[data-testid="dmComposerTextInput"]'
            );
            if (!inputElement) return;

            inputRef.current = inputElement;
            const initialPosition = getTextInputPositionTwitter(inputElement);
            addListener(inputElement, "input", ({ target }) => {
              setMessageText(target.textContent);
            });
            setPosition(initialPosition);
          }
        });
      });

      observer.observe(targetNode, { childList: true, subtree: true });

      return () => observer.disconnect();
    };

    const observerTimer = setInterval(() => {
      if (document.querySelector('div[data-testid="DmActivityViewport"]')) {
        // clearInterval(observerTimer);
        observeDMActivity();
      }
    }, 500);

    return () => clearInterval(observerTimer);
  }, [isTwitter]);

  if (!messageText?.trim() || !settings?.extensionOn || !user) return <> </>;
  return (
    <TranslateBox
      initialPosition={position}
      originalText={messageText}
      handleTextClick={
        isTwitter
          ? handleTwitterText
          : isWhatsapp
          ? handleWhatsappText
          : handleTelegramText
      }
      handleClose={handleClose}
    />
  );
};

export default App;
