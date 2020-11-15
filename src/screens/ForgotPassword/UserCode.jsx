import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "services";
import { t } from "services/languageManager";
import { verifyCode } from "Api/account-api";
import CircleSpinner from "components/CircleSpinner";
import Input from "components/AuthInput";
import "./styles.scss";

const ForgotPasswordCode = ({ history, onSuccessVerifyCode, email }) => {
  const [{}, dispatch] = useGlobalState();
  const [spinner, toggleSpinner] = useState(false);
  const [code, setCode] = useState();

  //#region first tab
  function handleCodeChanged(e) {
    setCode(e.target.value);
  }
  function handleVerifyCode(e) {
    e.preventDefault();
    if (!spinner) {
      toggleSpinner(true);
      verifyCode()
        .onOk((result) => {
          const { access_token } = result;
          if (onSuccessVerifyCode) onSuccessVerifyCode(access_token);
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
        .unAuthorized((result) => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("LOGIN_UN_AUTHORIZED"),
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
        .call(email, code);
    }
  }
  //#endregion first tab
  //#region second tab
  function navToLogin() {
    history.push("/app/login");
  }

  return (
    <form
      id="forgotPassForm"
      onSubmit={handleVerifyCode}
      className="animated fadeIn forgetPassForm"
    >
      <h2 className="fogotPass_content_header">
        {t("FORGOT_PASS_CONTENT_TITLE")}
      </h2>
      <h5 className="fogotPass_content_desc">{t("FORGOT_PASS_CODE_DESC")}</h5>
      <Input
        title={t("FORGOT_PASS_CONTENT_CODE_INPUT")}
        type="text"
        placeholder={t("FORGOT_PASS_CONTENT_CODE_PLACEHOLDER")}
        autoFocus
        required
        onChange={handleCodeChanged}
      />
      <div className="fogotPass_content_buttons">
        <button
          type="submit"
          className="btn btn-primary"
          form="forgotPassForm"
          disabled={code === undefined ? true : false}
        >
          {!spinner ? t("DONE") : <CircleSpinner show={spinner} size="small" />}
        </button>
      </div>
      <div className="fogotPass_content_footer">
        <span>{t("SIGNUP_HAVE_ACCOUNT")}</span>
        <Link to="/app/login">
          {t("LOGIN").toUpperCase()}
        </Link>
      </div>
    </form>
  );
};
export default ForgotPasswordCode;
