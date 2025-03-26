import React from "react";
import Toggle from "react-toggle";
import styles from "../styles/components/switch.module.scss";

export default function MenuItem({
  text,
  tag,
  icon,
  type,
  onChange,
  defaultValue,
}) {
  const handleClick = () => {
    if (type !== "BUTTON") return;
    onChange();
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer} onClick={handleClick}>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        <div className={styles.labelWrapper}>
          {tag && <div className={styles.tag}>{tag}</div>}
          <span
            className={styles.text}
            style={type === "BUTTON" ? { cursor: "pointer" } : {}}
          >
            {text}
          </span>
        </div>
      </div>
      <div className={styles.inputContainer}>
        {type === "SWITCH" && (
          <Toggle
            checked={defaultValue}
            icons={false}
            onChange={onChange}
            className={styles.switch}
          />
        )}
      </div>
    </div>
  );
}
