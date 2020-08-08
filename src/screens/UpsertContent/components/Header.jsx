import React from "react";
import styles from "../styles.module.scss";
import useGlobalState from "services/stateManager";
import useLocale from "hooks/useLocale";

const Header = ({ formMode, history, contentType, onBackButtonClicked }) => {
  const [{ sysLocales }] = useGlobalState();
  const { currentLocale } = useLocale();
  function back() {
    if (onBackButtonClicked) onBackButtonClicked();
  }
  function getLocaleTitle(localeName, type) {
    const locale = sysLocales.find((l) => l.name === localeName);
    if (locale !== undefined) return locale.title;
    return type === "name" ? "" : "none";
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
      <div className={styles.language}>{getLocaleTitle(currentLocale)}</div>
    </div>
  );
};
export default Header;
