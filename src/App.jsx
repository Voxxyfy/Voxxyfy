import React, { useState, useEffect, useRef } from "react";
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
import { getFromStorage } from "./controllers/storageController";
import urls from "./constants/urls.json";

const App = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messageText, setMessageText] = useState("");
  const [isTwitter, setIsTwitter] = useState(false);
  const [isWhatsapp, setIsWhatsapp] = useState(false);
  const [user, setUser] = useState(null);
  const [appSettings, setAppSettings] = useState({
    extensionOn: true,
    autoSend: false,
  });

  const inputRef = useRef(null);
  const twitterTimerRef = useRef(null);

  const handleTextClickTwitter = (translation) => {
    if (inputRef.current) {
      replaceDraftJsText(translation);
      const sendBtn = document.querySelector(
        'button[data-testid="dmComposerSendButton"]'
      );
      setTimeout(() => {
        setMessageText(""); //closes the translate box automatically
      }, 100);
      if (appSettings.autoSend) {
        setTimeout(() => {
          sendBtn?.click();
        }, 300);
      }
    }
  };

  const handleWhatsappTextClick = (translation) => {
    if (inputRef.current) {
      clearAndReplaceText(inputRef.current, translation);

      if (appSettings.autoSend) {
        setTimeout(() => {
          const main = document.querySelector("#main");
          if (!main) return;
          const sendButton = main.querySelector('span[data-icon="send"]');
          if (sendButton) sendButton.click();
        }, 500);
      }
      setMessageText(""); //closes the translate box automatically
    }
  };

  const handleTextClick = (translation) => {
    if (inputRef.current) {
      const event = new Event("input", { bubbles: true });
      inputRef.current.textContent = translation;
      inputRef.current.dispatchEvent(event);
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
      });
      if (appSettings.autoSend) inputRef.current.dispatchEvent(enterEvent);
      setMessageText(""); //closes the translate box automatically
    }
  };

  const addTweetButton = () => {
    if (twitterTimerRef.current) clearInterval(twitterTimerRef.current);

    twitterTimerRef.current = setInterval(() => {
      const isExist = document.querySelector(
        "#voxxyfy-translate-button-root"
      );
      if (isExist) return;

      const postButton = document.querySelector(
        'button[data-testid="tweetButtonInline"]'
      );
      if (!postButton) return;

      const parentElement = postButton?.parentElement;
      const rootElem = document.createElement("div");
      rootElem.id = "voxxyfy-translate-button-root";
      parentElement?.insertBefore(rootElem, postButton);

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
      setIsTwitter(true);

      const timer = setInterval(() => {
        const inputElement = document.querySelector(
          'div[data-testid="dmComposerTextInput"]'
        );

        if (!inputElement) return;
        if (inputElement.getAttribute("data-listener-added") === "true") return;
        inputElement.setAttribute("data-listener-added", "true");

        inputRef.current = inputElement;
        addBackspaceListener();
        addTweetBackspaceListener();
        const initialPosition = getTextInputPositionTwitter(inputElement);
        addListener(inputElement, "keyup", ({ target }) => {
          setMessageText(target.textContent);
        });
        setPosition(initialPosition);
      }, 300);

      return () => clearInterval(timer);
    }

    if (type === "TELEGRAM") {
      addMessageTranslateButtons();

      const timer = setInterval(() => {
        const inputElement = document.querySelector("#editable-message-text");
        if (!inputElement) return;

        clearInterval(timer);
        inputRef.current = inputElement;
        const initialPosition = getTextInputPosition(inputElement);
        addListener(inputElement, "input", ({ target }) =>
          setMessageText(target.textContent)
        );
        setPosition(initialPosition);
      }, 300);

      return () => clearInterval(timer);
    }

    if (type === "WHATSAPP") {
      setIsWhatsapp(true);
      addWhatsappTranslateButtons();

      const timer = setInterval(() => {
        const main = document.querySelector("#main");
        if (!main) return;
        const inputElement = main.querySelector('div[contenteditable="true"]');
        if (!inputElement) return;

        clearInterval(timer);
        inputRef.current = inputElement;
        const initialPosition = getWhatsAppInputPosition(inputElement);
        addListener(inputElement, "input", ({ target }) =>
          setMessageText(target.textContent)
        );
        setPosition(initialPosition);
      }, 300);

      return () => clearInterval(timer);
    }
  }, [window.location.href, user]);

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

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== "local") return;
      if (changes.settings) {
        setAppSettings({ ...appSettings, ...changes.settings.newValue });
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      const settings = await new Promise((resolve) => {
        chrome.storage.local.get("settings", (result) => {
          resolve(result.settings);
        });
      });
      setAppSettings(settings);
    })();
  }, [appSettings]);

  useEffect(() => {
    (async () => {
      const { user } = await getFromStorage("user");
      if (!user) return;

      setUser(user);
    })();
  }, []);

  if (!messageText || !appSettings?.extensionOn || !user) return <> </>;
  return (
    <TranslateBox
      initialPosition={position}
      originalText={messageText}
      handleTextClick={
        isTwitter
          ? handleTextClickTwitter
          : isWhatsapp
          ? handleWhatsappTextClick
          : handleTextClick
      }
      handleClose={handleClose}
    />
  );
};

export default App;
