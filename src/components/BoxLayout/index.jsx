import React, { useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./styles.module.scss";
const BoxLayout = ({ children, customClass = "" }, ref) => {
  const boxRef = useRef(null);
  useImperativeHandle(ref, () => boxRef.current);
  return (
    <div ref={boxRef} className={styles.box + " " + customClass}>
      {children}
    </div>
  );
};
export default forwardRef(BoxLayout);
