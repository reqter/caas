import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "services";
import { t } from "services/languageManager";
import { fortgotPassword } from "Api/account-api";
import CircleSpinner from "components/CircleSpinner";
import Input from "components/AuthInput";
import "./styles.scss";

const ForgotPassword = ({ history, onSuccessEmail }) => {
  const [{}, dispatch] = useGlobalState();
  const [spinner, toggleSpinner] = useState(false);
  const [email, setEmail] = useState();

  //#region first tab
  function handleEmailChanged(e) {
    setEmail(e.target.value);
  }
  function sendCodeToEmail(e) {
    e.preventDefault();
    if (!spinner) {
      toggleSpinner(true);
      fortgotPassword()
        .onOk((result) => {
          toggleSpinner(false);
          if (onSuccessEmail) onSuccessEmail(email);
        })
        .onServerError((result) => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_ON_SERVER_ERROR"),
            },
          });
        })
        .onBadRequest((result) => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_ON_BAD_REQUEST"),
            },
          });
        })
        .notFound((result) => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_NOT_FOUND"),
            },
          });
        })
        .call(email);
    }
  }
  //#endregion first tab
  //#region second tab
  function navToLogin() {
    history.push("login");
  }

  return (
    <form
      id="forgotPassForm"
      onSubmit={sendCodeToEmail}
      className="animated fadeIn forgetPassForm"
    >
      <h2 className="fogotPass_content_header">
        {t("FORGOT_PASS_CONTENT_TITLE")}
      </h2>
      <h5 className="fogotPass_content_desc">{t("FORGOT_PASS_EMAIL_DESC")}</h5>
      <Input
        title={t("EMAIL_ADDRESS")}
        type="email"
        placeholder={t("EMAIL_ADDRESS_PLACEHOLDER")}
        autoFocus
        required
        onChange={handleEmailChanged}
      />
      <div className="fogotPass_content_buttons">
        <button
          type="submit"
          className="btn btn-primary"
          form="forgotPassForm"
          disabled={email === undefined ? true : false}
        >
          {!spinner ? (
            t("SEND_CODE")
          ) : (
            <CircleSpinner show={spinner} size="small" />
          )}
        </button>
      </div>
      <div className="fogotPass_content_footer">
        <span>{t("SIGNUP_HAVE_ACCOUNT")}</span>
        <Link to="/login">
          {t("LOGIN").toUpperCase()}
        </Link>
      </div>
    </form>
  );
};
export default ForgotPassword;
