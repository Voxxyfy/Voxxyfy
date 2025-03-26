import axios from "axios";
import { SERVER_URL } from "./config";
import { saveToStorage, getFromStorage } from "./controllers/storageController";

const updateCredits = async (credits) => {
  const { user } = await getFromStorage("user");
  const userData = user.user;
  await saveToStorage({ user: { ...user, user: { ...userData, credits } } });
};

const saveUser = async (data) => {
  await saveToStorage({ user: data });
};

const getCredits = async () => {
  try {
    const { user } = await getFromStorage("user");
    console.log("USER => ", user);
    const token = user?.token;
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(SERVER_URL + "/user/me", { headers });
    console.log("response =>", response.data);
    const { credits } = response.data;

    if (credits) updateCredits(credits);
    return user;
  } catch (error) {
    if (error.status === 401) return chrome.storage.local.clear();
  }
};

const getTranslation = async (text, reverse, detectLang) => {
  return new Promise(async (resolve, reject) => {

    try {
      const { user, settings } = await getFromStorage(["user", "settings"]);
      if (!user) return resolve(false);
      if (!user.token) return resolve(false);

      const authToken = user?.token;
      const fromLanguage = settings?.translateFrom?.value?.toUpperCase();
      const toLanguage = settings?.translateTo?.value?.toUpperCase();

      let data = {
        text,
        targetLanguage: reverse ? toLanguage || "English" : fromLanguage || "French",
        sourceLanguage: reverse ? fromLanguage || "French" : toLanguage || "English",
      };

      if (detectLang) data.sourceLanguage = null;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      const response = await axios.post(SERVER_URL + "/translate", data, {
        headers,
      });

      return resolve(response.data);
    } catch (error) {
      console.log("error =>", error);
      return resolve(error?.response?.data || null);
    }
  });
};

const handleLogin = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(SERVER_URL + "/auth/login", data, {
        headers,
      });

      return resolve(response.data);
    } catch (error) {
      resolve(false);
    }
  });
};

getCredits();

chrome.runtime.onInstalled.addListener(() => {
  const defaultSettings = {
    translateTo: {
      value: "fr",
      label: " French",
      flag: "https://flagcdn.com/fr.svg",
    },
    translateFrom: {
      value: "en",
      label: " English",
      flag: "https://flagcdn.com/us.svg",
    },
    extensionOn: true,
    autoSend: false,
  };

  saveToStorage({ settings: defaultSettings });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    console.log("request");
    try {
      switch (request.action) {
        case "GET_TRANSLATION":
          const response = await getTranslation(
            request.text,
            request.reverse,
            request.detectLang
          );
          if (response.remainingCredits)
            updateCredits(response.remainingCredits);
          sendResponse(response);
          break;
        case "LOGIN":
          const loginResponse = await handleLogin(request.data);
          if (loginResponse.token) saveUser(loginResponse);
          sendResponse(loginResponse);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  })();

  return true;
});
