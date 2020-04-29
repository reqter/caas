import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import Box from "./../../BoxLayout";

const Stats = ({ title, value, link, icon, color }) => {
  return (
    <Box customClass={styles.statsBox}>
      <div className={styles.top}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.bottom}>
        <div className={styles.icon} style={{ backgroundColor: color }}>
          <i className={icon} />
        </div>
        <span className={styles.value} style={{ color }}>
          {value ? value["count"] : "----"}
        </span>
      </div>
    </Box>
  );
};

export default Stats;
