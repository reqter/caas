import React from "react";
import styles from "../styles.module.scss";

const Header = ({ formMode, history, contentType, onBackButtonClicked }) => {
  function back() {
    if (onBackButtonClicked) onBackButtonClicked();
  }

  return (
    <div className={styles.header}>
      <button className="btn btn-light btn-sm" onClick={back}>
        <i className="icon-arrow-left2" />
        Back
      </button>
      <div className={styles.tabItems}>
        <div>
          {formMode === "new"
            ? "New Content"
            : formMode === "edit"
            ? "Edit Content"
            : "View Content"}
        </div>
      </div>
    </div>
  );
};
export default Header;
