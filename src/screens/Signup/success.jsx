import React from "react";
import { withRouter } from "react-router-dom";
import { t } from "services/languageManager";

const SignupSuccess = ({ history }) => {
  //#region second tab
  function navToLogin() {
    history.push("login");
  }
  return (
    <div className="signuupSuccess animate fadeIn">
      <h2>{t("SIGNUUP_SUCCESS_CONTENT_TITLE")}</h2>
      <div className="signuupSuccess__icon">
        <i className="icon-checkmark" />
      </div>
      <h3 className="signuupSuccess__message">
        {t("SIGNUUP_SUCCESS_CONTENT_MSG")}
      </h3>
      <button className="btn btn-primary" onClick={navToLogin}>
        {t("LOGIN").toUpperCase()}
      </button>
    </div>
  );
};
export default withRouter(SignupSuccess);
