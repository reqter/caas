import React from "react";
import styles from "./styles.module.scss";

const Item = ({ data }) => {
  return (
    <div className={styles.item}>
      <div className={styles.index}>2</div>
      <div className={styles.imageBox}>
        <img src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/15519179861536080156-512.png" />
      </div>
      <div className={styles.textBox}>
        <span>Image NO112</span>
      </div>
      <div className={styles.label + " badge badge-light"}>Request</div>
      <div className={styles.date}>2 hours ago</div>
      <button className={styles.btn + " btn btn-outline-primary btn-sm"}>
        View
      </button>
    </div>
  );
};
export default Item;
