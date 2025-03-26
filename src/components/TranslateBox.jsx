import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/translatebox.module.scss";
import { motion } from "motion/react";

const TranslateBox = ({ originalText, initialPosition, handleTextClick, handleClose }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [error, setError] = useState(false);

  const handleTranslatePress = () => {
    if (error) return;
    handleTextClick(translation);
  };

  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    setPosition({ ...initialPosition });
  }, [initialPosition]);

  useEffect(() => {
    try {
      const getTranslation = async () => {
        const response = await chrome.runtime.sendMessage({
          action: "GET_TRANSLATION",
          text: originalText,
          reverse: true,
          detectLang: true,
        });

        if (response && !response?.message) {
          setLoading(false);
          setError(false);
          return setTranslation(response.translation);
        }

        if (
          response?.message &&
          response?.message.includes("Bad language pair")
        ) {
          setLoading(false);
          setError(true);
          return setTranslation("Please select a different language pair");
        }

        setLoading(false);
        setError(true);
        setTranslation("Something went wrong...");
      };

      setLoading(true);
      const timer = setTimeout(getTranslation, 2000);

      return () => clearTimeout(timer);
    } catch (error) {}
  }, [originalText]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: 99999,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className={styles.translateBoxContainer}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setSettingsVisible(true)}
      onMouseLeave={() => setSettingsVisible(false)}
    >
      <div className={styles.translateBox}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
          >
            <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71a1 1 0 0 0-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 0 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" />
          </svg>
        </button>
        {loading && <div className={styles.loadingDots}></div>}
        {!loading && (
          <div className={styles.translation} onClick={handleTranslatePress}>
            {translation}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TranslateBox;
