import React, { useEffect, useState } from "react";
import styles from "../styles/components/usageMeter.module.scss";
import voxCoin from "../assets/images/voxCoin.svg";

export default function UsageMeter({ value = 0, max = 10 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress((value / max) * 100);
    }, 300);
  }, [value, max]);

  return (
    <div className={styles.container}>
      <div className={styles.usageContainer}>
        <div className={styles.voxCoinContainer}>
          <img src={voxCoin} alt="VoxCoin" />
        </div>
        <span className={styles.usageValue}>{value?.toLocaleString()}</span>
      </div>
    </div>
  );
}
