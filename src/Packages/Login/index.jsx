import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  languageManager,
  useGlobalState,
  storageManager,
} from "./../../services";
import { login } from "./../../Api/account-api";
import { CircleSpinner } from "./../../components";
import "./styles.scss";

const Login = props => {
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
        .onOk(result => {
          //toggleSpinner(false);
          try {
            storageManager.setItem("token", result.access_token);
            dispatch({
              type: "SET_AUTHENTICATED",
              value: true,
            });
            setRedirectToReferrer(true);
          } catch (error) {
            console.log(error);
          }
          //localStorage.setItem("token", result.access_token);
        })
        .onServerError(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("LOGIN_ON_SERVER_ERROR"),
            },
          });
        })
        .onBadRequest(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("LOGIN_ON_BAD_REQUEST"),
            },
          });
        })
        .unAuthorized(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("LOGIN_UN_AUTHORIZED"),
            },
          });
        })
        .notFound(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: result.error
                ? result.error
                : languageManager.translate("LOGIN_NOT_FOUND"),
            },
          });
        })
        .call(userName, password);
    }
  }
  useEffect(() => {
    if (redirectToReferrer) {
      props.history.replace(
        !props.location.state ? "panel" : props.location.state.from.pathname
      );
    }
    return () => {
      toggleSpinner(false);
    };
  }, [redirectToReferrer]);

  return (
    <div className="wrapper">
      <div className="center">
        <div className="header">
          <span className="header-title">
            {languageManager.translate("LOGIN_TITLE")}
          </span>
        </div>
        <div className="formBody">
          <form id="loginForm" onSubmit={loginUser}>
            <div className="form-group">
              <label>
                {languageManager.translate("LOGIN_EMAIL_INPUT_TITLE")}
              </label>
              <input
                type="email"
                className="form-control"
                aria-describedby="emailHelp"
                placeholder={languageManager.translate(
                  "LOGIN_EMAIL_INPUT_PLACEHOLDER"
                )}
                onChange={handleEmailChanged}
                autoFocus
              />
              <small className="form-text text-muted">
                {languageManager.translate("LOGIN_EMAIL_INPUT_DESCRIPTION")}
              </small>
            </div>
            <div className="form-group">
              <label>{languageManager.translate("LOGIN_PASSWORD_INPUT")}</label>
              <input
                type="password"
                className="form-control"
                placeholder={languageManager.translate(
                  "LOGIN_PASSWORD_INPUT_PLACEHOLDER"
                )}
                onChange={handlePasswordChanged}
              />
              <small className="form-text text-muted">
                {languageManager.translate("LOGIN_PASSWORD_INPUT_DESCRIPTION")}
              </small>
            </div>
            <Link to="/forgotPassword">
              {languageManager.translate("LOGIN_FORGOT_PASS")}
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-submit"
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
              <CircleSpinner show={spinner} size="small" />
              {!spinner ? languageManager.translate("LOGIN_SUBMIT_BTN") : null}
            </button>
          </form>
        </div>
      </div>

      <div className="signUpBox">
        <span>
          {languageManager.translate("LOGIN_SIGNUP_LINK_TITLE")}&nbsp;
        </span>
        <Link to="/signup">
          {languageManager.translate("LOGIN_SIGNUP_LINK")}
        </Link>
      </div>
    </div>
  );
};
export default Login;
