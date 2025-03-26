import React, { useEffect, useState } from "react";
import styles from "../styles/screens/dashboard.module.scss";

import {
  getFromStorage,
  saveToStorage,
} from "../controllers/storageController";

import crownIcon from "../assets/images/crown.svg";
import languageList from "../constants/languages.json";

import UsageMeter from "../components/UsageMeter";
import MenuItem from "../components/MenuItem";
import Switch from "../components/Switch";
import Footer from "../components/Footer";

const fromDefault = {
  value: "fr",
  label: " French",
  flag: "https://flagcdn.com/fr.svg",
};
const toDefault = {
  value: "en",
  label: " English",
  flag: "https://flagcdn.com/us.svg",
};

export default function Dashboard({ userData }) {
  const [languages, setLanguages] = useState([]);
  const [extensionOn, setExtensionOn] = useState(true);
  const [autoSend, setAutoSend] = useState(false);
  const [translateFrom, setTranslateFrom] = useState(fromDefault);
  const [translateTo, setTranslateTo] = useState(toDefault);
  const [menuOpen, setMenuOpen] = useState(false);

  const getStoredValues = async () => {
    const { settings } = await getFromStorage("settings");
    if (!settings) return;

    setExtensionOn(
      settings.extensionOn === undefined ? true : settings.extensionOn
    );
    setAutoSend(settings.autoSend);
    setTranslateFrom(settings.translateFrom);
    setTranslateTo(settings.translateTo);
  };

  const saveSettings = async (key, value) => {
    const { settings } = (await getFromStorage("settings")) || {};
    await saveToStorage({
      settings: {
        ...settings,
        [key]: value,
      },
    });
  };

  const handleExtensionToggle = () => {
    setExtensionOn(!extensionOn);
    saveSettings("extensionOn", !extensionOn);
  };

  const handleAutoSendToggle = () => {
    console.log("autoSend", !autoSend);

    setAutoSend(!autoSend);
    saveSettings("autoSend", !autoSend);
  };

  const handleChangeFrom = (value) => {
    setTranslateFrom(value);
    saveSettings("translateFrom", value);
  };

  const handleChangeTo = (value) => {
    setTranslateTo(value);
    saveSettings("translateTo", value);
  };

  useEffect(() => {
    getStoredValues();
    const langList = languageList.map((lang) => ({
      value: lang.value,
      label: lang.label,
      flag: lang.flag,
    }));
    setLanguages(langList);
  }, [languageList]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <UsageMeter
          value={userData?.user?.credits}
          max={userData?.user?.creditsLimit}
        />
        <div className={styles.menuItemList}>
          <MenuItem
            text="My Language"
            type="SELECT"
            data={languages}
            exclude={translateTo}
            defaultValue={translateFrom}
            onChange={handleChangeFrom}
          />
          <MenuItem
            text="Translate To"
            type="SELECT"
            data={languages}
            defaultValue={translateTo}
            exclude={translateFrom}
            onChange={handleChangeTo}
          />
          <div className={styles.row}>
            <div className={styles.switchWrapper}>
              <Switch
                text="Translation"
                defaultValue={extensionOn}
                type="SWITCH"
                onChange={handleExtensionToggle}
              />
              <Switch
                text="Auto Send"
                defaultValue={autoSend}
                type="SWITCH"
                onChange={handleAutoSendToggle}
              />
            </div>
            <div className={styles.crownWrapper}>
              <button
                className={styles.crownButton}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <img src={crownIcon} alt="" className={styles.crownIcon} />
                <span className={styles.crownText}>Upgrade</span>
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
