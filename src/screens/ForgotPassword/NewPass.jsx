import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "services";
import { t } from "services/languageManager";
import { resetPassword } from "Api/account-api";
import CircleSpinner from "components/CircleSpinner";
import Input from "components/AuthInput";
import "./styles.scss";

const ForgotPassword = ({ history, onSuccessChangePassword, token }) => {
  const [{}, dispatch] = useGlobalState();
  const [state, setState] = useState({
    spinner: false,
    newPass: "",
    confirmPass: ""
  });

  //#region first tab
  function handleInputChanged(e) {
    const name = e.target.name;
    const value = e.target.value;
    setState(prevState => ({ ...prevState, [name]: value }));
  }
  function handleResetPassword(e) {
    e.preventDefault();
    if (!spinner) {
      const { newPass } = state;
      resetPassword()
        .onOk(result => {
          // setState(prevState => ({
          //   ...prevState,
          //   spinner: !prevState.spinner
          // }));
          if (onSuccessChangePassword) onSuccessChangePassword();
        })
        .onServerError(result => {
          setState(prevState => ({
            ...prevState,
            spinner: !prevState.spinner
          }));
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_ON_SERVER_ERROR")
            }
          });
        })
        .onBadRequest(result => {
          setState(prevState => ({
            ...prevState,
            spinner: !prevState.spinner
          }));
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_ON_BAD_REQUEST")
            }
          });
        })
        .unAuthorized(result => {
          setState(prevState => ({
            ...prevState,
            spinner: !prevState.spinner
          }));
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_UN_AUTHORIZED")
            }
          });
        })
        .notFound(result => {
          setState(prevState => ({
            ...prevState,
            spinner: !prevState.spinner
          }));
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_NOT_FOUND")
            }
          });
        })
        .call(token, newPass);
    }
  }
  //#endregion first tab
  //#region second tab
  function navToLogin() {
    history.push("login");
  }

  const { spinner, newPass, confirmPass } = state;

  return (
    <form
      id="forgotPassForm"
      onSubmit={handleResetPassword}
      className="animated fadeIn forgetPassForm"
    >
      <h2 className="fogotPass_content_header">
        {t("FORGOT_PASS_CONTENT_CHANGE_TITLE")}
      </h2>
      <Input
        title={t("NEW_PASS_INPUT")}
        type="text"
        placeholder={t("NEW_PASS_PLACEHOLDER")}
        autoFocus
        required
        name="newPass"
        onChange={handleInputChanged}
      />
      <Input
        title={t("CONFIRM_PASS_INPUT")}
        type="text"
        placeholder={t("CONFIRM_PASS_PLACEHOLDER")}
        required
        name="confirmPass"
        onChange={handleInputChanged}
      />
      <div className="fogotPass_content_buttons">
        <button
          type="submit"
          className="btn btn-primary"
          form="forgotPassForm"
          disabled={
            newPass === undefined ||
            confirmPass === undefined ||
            newPass !== confirmPass
              ? true
              : false
          }
        >
          {!spinner ? (
            t("RESET_PASSWORD")
          ) : (
            <CircleSpinner show={spinner} size="small" />
          )}
        </button>
      </div>
      <div className="fogotPass_content_footer">
        <span>{t("SIGNUP_HAVE_ACCOUNT")}</span>
        <Link to="/login" className="link">
          {t("LOGIN").toUpperCase()}
        </Link>
      </div>
    </form>
  );
};
export default ForgotPassword;
