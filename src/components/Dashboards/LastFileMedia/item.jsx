import React from "react";
import styles from "./styles.module.scss";

const Item = () => {
  return (
    <div className={styles.item}>
      <div className={styles.imageBox}>
        <img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/15519179861536080156-512.png" />
      </div>
      <div className={styles.textBox}>
        <span>Image NO112</span>
        <span>5 sec ago</span>
      </div>
    </div>
  );
};
export default Item;
