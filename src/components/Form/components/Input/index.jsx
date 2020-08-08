import React, { useRef, useImperativeHandle, forwardRef } from "react";
import styles from "../styles.module.scss";

const Input = (
  { name, hasError = false, title = "", info = "", type = "text", ...rest },
  ref
) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);
  return (
    <div className={styles.input__group}>
      <label className={styles.label}>{title}</label>
      <input
        name={name}
        ref={inputRef}
        type={type}
        className={styles.input + " " + (hasError ? styles.input_error : "")}
        {...rest}
      />
      <span className={styles.info}>{info}</span>
    </div>
  );
};
export default forwardRef(Input);
