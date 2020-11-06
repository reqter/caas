import React from "react";
import Logo from "../logo";
const Form = ({ render }) => {
  return (
    <div className="authLayout__left">
      <div className="authLayout__logo">
        <Logo />
      </div>
      {render()}
    </div>
  );
};
export default Form;
