import { useState, useEffect } from 'react';
import urls from '../constants/urls.json';

export const usePlatform = () => {
  const [platform, setPlatform] = useState({
    isTwitter: false,
    isWhatsapp: false,
    isTelegram: false,
  });

  useEffect(() => {
    const hostname = window.location.hostname;
    const type = urls.find((item) => item.url === hostname)?.type;

    setPlatform({
      isTwitter: type === 'TWITTER',
      isWhatsapp: type === 'WHATSAPP',
      isTelegram: type === 'TELEGRAM',
    });
  }, [window.location.href]);

  return platform;
};

export const useInputElement = (platform) => {
  const [inputElement, setInputElement] = useState(null);

  useEffect(() => {
    const findInput = () => {
      let element = null;
      if (platform.isTwitter) {
        element = document.querySelector('div[data-testid="dmComposerTextInput"]');
      } else if (platform.isTelegram) {
        element = document.querySelector('#editable-message-text');
      } else if (platform.isWhatsapp) {
        const main = document.querySelector('#main');
        element = main?.querySelector('div[contenteditable="true"]');
      }
      return element;
    };

    const timer = setInterval(() => {
      const element = findInput();
      if (element && !element.getAttribute('data-listener-added')) {
        element.setAttribute('data-listener-added', 'true');
        setInputElement(element);
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, [platform]);

  return inputElement;
}; 