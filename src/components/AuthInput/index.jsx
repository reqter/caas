import React from "react";
import styles from "./styles.module.scss";
const Input = ({ title, ...rest }) => {
  return <input className={styles.input} {...rest} />;
};
export default Input;
