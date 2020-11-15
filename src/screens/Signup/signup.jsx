import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "services";
import { t } from "services/languageManager";
import { signup } from "Api/account-api";
import CircleSpinner from "components/CircleSpinner";
import Input from "components/AuthInput";
import "./styles.scss";

const Register = ({ onSuccessSignup }) => {
  const [{}, dispatch] = useGlobalState();

  const [spinner, toggleSpinner] = useState(false);
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [repeatPass, setRepeatPassword] = useState();

  //#region first tab
  function handleEmailChanged(e) {
    setUserName(e.target.value);
  }
  function handlePasswordChanged(e) {
    setPassword(e.target.value);
  }
  function handleRepPasswordChanged(e) {
    setRepeatPassword(e.target.value);
  }
  const showwError = () => {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: "error",
        message: t("SIGNUP_ERROR_TITLE"),
      },
    });
  };
  function signupUser(e) {
    e.preventDefault();
    if (!spinner) {
      toggleSpinner(true);
      signup()
        .onOk((result) => {
          if (onSuccessSignup) onSuccessSignup();
        })
        .onServerError((result) => {
          toggleSpinner(false);
          showwError();
        })
        .onBadRequest((result) => {
          toggleSpinner(false);
          showwError();
        })
        .unAuthorized((result) => {
          toggleSpinner(false);
          showwError();
        })
        .notFound((result) => {
          toggleSpinner(false);
          showwError();
        })
        .call(userName, password);
    }
  }

  return (
    <form id="signupForm" onSubmit={signupUser} className="animated fadeIn">
      <h2 className="siguup_content_header">{t("SIGNUP_CONTENT_TITLE")}</h2>
      <h5 className="signup_content_desc">{t("LOGIN_CONTENT_DESC")}</h5>
      <Input
        title={t("SIGNUP_EMAIL_INPUT_TITLE")}
        type="email"
        placeholder={t("SIGNUP_EMAIL_INPUT_PLACEHOLDER")}
        autoFocus
        required
        onChange={handleEmailChanged}
      />
      <Input
        title={t("SIGNUP_PASSWORD_INPUT")}
        type="password"
        placeholder={t("SIGNUP_PASSWORD_INPUT_PLACEHOLDER")}
        required
        onChange={handlePasswordChanged}
      />
      <Input
        title={t("SIGNUP_CONFIRM_PASSWORD_INPUT")}
        type="password"
        placeholder={t("SIGNUP_CONFIRM_PASSWORD_INPUT")}
        required
        onChange={handleRepPasswordChanged}
      />
      <div className="signup_content_buttons">
        <button
          type="submit"
          className="btn btn-info"
          form="signupForm"
          disabled={
            repeatPass === undefined ||
            password === undefined ||
            repeatPass !== password
              ? true
              : false
          }
        >
          {!spinner ? (
            t("SIGNUO_SUBMIT_BTN_TEXT")
          ) : (
            <CircleSpinner show={spinner} size="small" />
          )}
        </button>
      </div>
      <div className="siguup_content_footer">
        <span>{t("SIGNUP_HAVE_ACCOUNT")}</span>
        <Link to="/app/login">{t("LOGIN").toUpperCase()}</Link>
      </div>
    </form>
  );
};
export default Register;
