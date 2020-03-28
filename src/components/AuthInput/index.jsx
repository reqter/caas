import React from "react";
import styles from "./styles.module.scss";
const Input = ({ title, ...props }) => {
  return (
    <div className={styles.input}>
      <label className={styles.input__title}>{title}</label>
      <input className={styles.input__element} {...props} />
    </div>
  );
};
export default Input;
