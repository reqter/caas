import React from "react";
import "./styles.scss";
import { languageManager } from "../../services";
//
const pageTitle = languageManager.translate("HOME_SIDE_NAV_HOME");
const pageDescription = languageManager.translate("HOME_SIDE_NAV_HOME_DESC");
//
export default function Home(props) {
  return (
    <div className="h-wrapper">
      <div className="h-header">
        <div className="h-header-left">
          <span className="h-header-title">{pageTitle}</span>
          <span className="h-header-description">{pageDescription}</span>
        </div>
        <div className="h-header-right" />
      </div>
      <div className="h-content" />
    </div>
  );
}
