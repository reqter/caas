import React from "react";
import styles from "./styles.module.scss";
const BoxLayout = ({
  title,
  description,
  renderHeader = () => {},
  children,
}) => {
  return (
    <div className={styles.p_wrapper}>
      <div className={styles.p_header}>
        <div className={styles.p_header_left}>
          <span className={styles.p_header_title}>{title}</span>
          <span className={styles.p_header_description}>{description}</span>
        </div>
        <div className={styles.p_header_right}>{renderHeader()}</div>
      </div>
      <div className={styles.p_content}>{children}</div>
    </div>
  );
};
export default BoxLayout;
