import React from "react";
import { withRouter } from "react-router-dom";
import { t } from "services/languageManager";

const ChangePassSuccess = React.memo(({ history }) => {
  //#region second tab
  function navToLogin() {
    history.push("/app/login");
  }
  return (
    <div className="forgetPassForm forgetPassSuccess animate fadeIn">
      <h3>{t("FORGOT_PASS_CONTENT_TITLE")}</h3>
      <h3 className="forgetPassSuccess__message">
        {t("CHANGE_PASS_SUCCESS_CONTENT_MSG")}
      </h3>
      <button className="btn btn-primary" onClick={navToLogin}>
        {t("LOGIN").toUpperCase()}
      </button>
    </div>
  );
});
export default withRouter(ChangePassSuccess);
