import React, { useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./styles.module.scss";
const BoxLayout = ({ children, customClass = "", ...rest }, ref) => {
  const boxRef = useRef(null);
  useImperativeHandle(ref, () => boxRef.current);
  return (
    <div ref={boxRef} className={styles.box + " " + customClass} {...rest}>
      {children}
    </div>
  );
};
export default forwardRef(BoxLayout);
