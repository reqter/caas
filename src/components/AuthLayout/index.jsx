import React from "react";
import Wave from "./svg";
import Logo from "./logo";
import "./styles.scss";

const AuthLayout = ({ image, title, description, render }) => {
  return (
    <div className="authLayout">
      <div className="authLayout__left">
        <div className="authLayout__leftContent">
          <div className="authLayout__logo">
            <Logo />
          </div>
          <div className="authLayout__form">{render()}</div>
        </div>
      </div>
      <div className="authLayout__right">
        <div className="authLayout__assets">
          <div className="authLayout__text">
            <h1 className="authLayout__title">{title}</h1>
            <span className="authLayout__desc">{description}</span>
          </div>
          <div className="authLayout__img">{image}</div>
        </div>
        <Wave />
      </div>
    </div>
  );
};
export default AuthLayout;
