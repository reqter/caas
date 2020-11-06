import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useGlobalState, storageManager } from "services";
import { t } from "services/languageManager";
import { login } from "Api/account-api";
import CircleSpinner from "components/CircleSpinner";
import Input from "components/AuthInput";
import AuthLayout from "shared/layouts/AuthLayout";
import SvgImage from "./svgImage";
import "./styles.scss";

const Login = ({ location, history }) => {
  const [{}, dispatch] = useGlobalState();
  const [spinner, toggleSpinner] = useState(false);
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  function handleEmailChanged(e) {
    setUserName(e.target.value);
  }
  function handlePasswordChanged(e) {
    setPassword(e.target.value);
  }

  function loginUser(e) {
    e.preventDefault();
    if (!spinner) {
      toggleSpinner(true);
      login()
        .onOk((result) => {
          //toggleSpinner(false);
          try {
            storageManager.setItem("@caaser-token", result.access_token);
            dispatch({
              type: "SET_AUTHENTICATED",
              value: true,
            });
            setRedirectToReferrer(true);
          } catch (error) {}
          //localStorage.setItem("token", result.access_token);
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
              message: result.error ? result.error : t("LOGIN_NOT_FOUND"),
            },
          });
        })
        .call(userName, password);
    }
  }
  useEffect(() => {
    if (redirectToReferrer) {
      history.replace(
        !location.state ? "/panel/home" : location.state.from.pathname
      );
    }
    return () => {
      toggleSpinner(false);
    };
  }, [history, location.state, redirectToReferrer]);

  return (
    <AuthLayout
      image={<SvgImage />}
      title={t("LOGIN_TITLE")}
      description={t("LOGIN_DESCRIPTION")}
      render={() => {
        return (
          <form id="loginForm" onSubmit={loginUser} className="animated fadeIn">
            <h2 className="login_content_header">{t("LOGIN_CONTENT_TITLE")}</h2>
            <h5 className="login_content_desc">{t("LOGIN_CONTENT_DESC")}</h5>
            <Input
              title={t("LOGIN_EMAIL_INPUT_TITLE")}
              type="email"
              placeholder={t("LOGIN_EMAIL_INPUT_PLACEHOLDER")}
              autoFocus
              required
              onChange={handleEmailChanged}
            />
            <Input
              title={t("LOGIN_PASSWORD_INPUT")}
              type="password"
              placeholder={t("LOGIN_PASSWORD_INPUT_PLACEHOLDER")}
              required
              onChange={handlePasswordChanged}
            />
            <Link to="/forgotPassword">
              {t("LOGIN_FORGET_PASS")}
            </Link>
            <div className="login_content_buttons">
              <button
                type="submit"
                className="btn btn-primary"
                form="loginForm"
                disabled={
                  userName === undefined ||
                  password === undefined ||
                  userName.length === 0 ||
                  password.length === 0
                    ? true
                    : false
                }
              >
                {!spinner ? (
                  t("LOGIN_SUBMIT_BTN")
                ) : (
                  <CircleSpinner show={spinner} size="small" />
                )}
              </button>
              <div className="login_content_signup">
                <span>{t("LOGIN_SIGNUP_LINK_TITLE")}</span>
                <Link to="/signup">{t("LOGIN_SIGNUP_LINK")}</Link>
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
export default Login;
