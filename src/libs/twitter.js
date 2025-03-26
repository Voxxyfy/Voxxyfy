import React from 'react';
import { createRoot } from 'react-dom/client';
import TranslateButton from "../components/TranslateButton";

const getTextInputPositionTwitter  = element => {
    const { left, top } = element.getBoundingClientRect();
    return {
        x: left + window.scrollX - element.offsetWidth / 2, 
        y: top + window.scrollY - element.offsetHeight * 3
    };
};

const addListenerTwitter  = (element, event, handler) => {
    element.addEventListener(event, handler);

    return () => {
        element.removeEventListener(event, handler);
    };
}

const addMessageTranslateButtonsTwitter  = () => {

    setInterval(() => {
        const allMsgBalloons = document.querySelectorAll('div[data-testid="messageEntry"]');

        allMsgBalloons.forEach(balloon => {
            const isButtonExist = balloon.querySelector('#voxxyfy-translate-button');
            const msgElem = balloon.querySelector('div[data-testid="tweetText"]');

            if (isButtonExist || !msgElem) return;

            const translateBtnContainer = document.createElement('div');
            const msgContentElm = msgElem.parentElement.parentElement;
            if (!msgContentElm) return;
            translateBtnContainer.id = 'voxxyfy-translate-button';

            msgContentElm.insertBefore(translateBtnContainer, msgContentElm.firstChild);
            balloon.style.position = "relative";

            const root = createRoot(balloon.querySelector('#voxxyfy-translate-button'));
            root.render(<TranslateButton msgElem={msgElem} />);
        });

    }, 300)
}

export { getTextInputPositionTwitter , addListenerTwitter , addMessageTranslateButtonsTwitter };