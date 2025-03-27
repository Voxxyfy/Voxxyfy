import React, { useRef, useEffect, useState } from "react";
import TranslateBox from "./components/TranslateBox";
import TweetTranslateBtn from "./components/TweetTranslateBtn";
import { createRoot } from "react-dom/client";
import {
  addListener,
  getTextInputPosition,
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
    setTimeout(() => setMessageText(''), 100);

    if (settings?.autoSend) {
      const sendBtn = document.querySelector('button[data-testid="dmComposerSendButton"]');
      setTimeout(() => sendBtn?.click(), 300);
    }
  };

  const handleWhatsappText = (translation) => {
    if (!inputRef.current) return;

    clearAndReplaceText(inputRef.current, translation);
    setMessageText('');

    if (settings?.autoSend) {
      setTimeout(() => {
        const main = document.querySelector('#main');
        const sendButton = main?.querySelector('span[data-icon="send"]');
        sendButton?.click();
      }, 500);
    }
  };

  const handleTelegramText = (translation) => {
    if (!inputRef.current) return;

    const event = new Event('input', { bubbles: true });
    inputRef.current.textContent = translation;
    inputRef.current.dispatchEvent(event);
    setMessageText('');

    if (settings?.autoSend) {
      const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
      });
      inputRef.current.dispatchEvent(enterEvent);
    }
  };

  const addTweetButton = () => {
    if (twitterTimerRef.current) {
      clearInterval(twitterTimerRef.current);
    }

    twitterTimerRef.current = setInterval(() => {
      const existingButton = document.querySelector('#voxxyfy-translate-button-root');
      if (existingButton) return;

      const postButton = document.querySelector('button[data-testid="tweetButtonInline"]');
      if (!postButton) return;

      const rootElem = document.createElement('div');
      rootElem.id = 'voxxyfy-translate-button-root';
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

  useEffect(() => {
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
        clearInterval(observerTimer);
        observeDMActivity();
      }
    }, 500);

    return () => clearInterval(observerTimer);
  }, []);

  if (!messageText || !settings?.extensionOn || !user) return <> </>;
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
