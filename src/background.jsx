import { authAPI, userAPI, translationAPI } from './services/api';
import { saveToStorage, getFromStorage } from './controllers/storageController';
import { MESSAGE_ACTIONS, STORAGE_KEYS, DEFAULT_SETTINGS } from './constants/actions';

const updateCredits = async (credits) => {
  const { user } = await getFromStorage(STORAGE_KEYS.USER);
  const userData = user.user;
  await saveToStorage({ 
    [STORAGE_KEYS.USER]: { 
      ...user, 
      user: { ...userData, credits } 
    } 
  });
};

const saveUser = async (data) => {
  await saveToStorage({ [STORAGE_KEYS.USER]: data });
};

const getCredits = async () => {
  try {
    const { user } = await getFromStorage(STORAGE_KEYS.USER);
    if (!user?.token) return;

    const response = await userAPI.getMe();
    const { credits } = response;

    if (credits) {
      await updateCredits(credits);
    }
    return user;
  } catch (error) {
    console.error('Error fetching credits:', error);
  }
};

// Initialize credits check
getCredits();

// Set default settings on installation
chrome.runtime.onInstalled.addListener(() => {
  saveToStorage({ [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case MESSAGE_ACTIONS.GET_TRANSLATION: {
          const { text, reverse, detectLang } = request;
          const { settings } = await getFromStorage(STORAGE_KEYS.SETTINGS);
          
          const response = await translationAPI.translate(text, {
            reverse,
            detectLang,
            fromLang: settings?.translateFrom?.value?.toUpperCase(),
            toLang: settings?.translateTo?.value?.toUpperCase(),
          });

          if (response?.remainingCredits) {
            await updateCredits(response.remainingCredits);
          }
          sendResponse(response);
          break;
        }

        case MESSAGE_ACTIONS.LOGIN: {
          const response = await authAPI.login(request.data);
          if (response?.token) {
            await saveUser(response);
          }
          sendResponse(response);
          break;
        }

        default:
          console.warn('Unknown message action:', request.action);
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    }
  })();

  // Return true to indicate we'll respond asynchronously
  return true;
});
