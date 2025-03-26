import React, { useEffect, useState } from "react";
import Toggle from "react-toggle";
import styles from "../styles/components/menuItem.module.scss";

import Select from "react-select";

export default function MenuItem({
  text,
  tag,
  icon,
  type,
  onChange,
  data,
  exclude,
  defaultValue,
}) {
  const [filteredData, setFilteredData] = useState(data);
  const handleClick = () => {
    if (type !== "BUTTON") return;
    onChange();
  };

  const CustomControl = (props) => {
    const { children, innerProps, options } = props;
    const firstChildValue = children[0].props?.getValue()[0].value;
    const foundFlag = options?.find(
      (option) => option.value === firstChildValue
    );

    return (
      <div
        {...innerProps}
        className={styles.option}
        style={{ display: "flex", alignItems: "center" }}
      >
        <img src={foundFlag?.flag} alt="" className={styles.flag} />
        {children}
      </div>
    );
  };

  const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;

    return (
      <div ref={innerRef} {...innerProps} className={styles.option}>
        <img src={data.flag} alt="" className={styles.flag} />
        {data.label}
      </div>
    );
  };

  useEffect(() => {
    if (exclude && exclude?.value) {
      setFilteredData(data.filter((item) => item.value !== exclude.value));
    }
  }, [data, exclude]);

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
        {type === "SELECT" && (
          <Select
            menuPlacement="auto"
            options={filteredData}
            components={{ Option: CustomOption, Control: CustomControl }}
            className={styles.select}
            value={{ ...defaultValue, label: defaultValue.label}}
            onChange={onChange}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "200px",
                backgroundColor: "#2A2A2A",
                color: "#fff",
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                display: "none",
              }),
              placeholder: (provided) => ({
                ...provided,
                display: "none",
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: "0",
                color: "#fff",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#fff",
              }),
              input: (provided) => ({
                ...provided,
                color: "#fff",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#333" : "#2A2A2A",
                color: state.isSelected ? "#fff" : "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }),
            }}
          />
        )}
      </div>
    </div>
  );
}
