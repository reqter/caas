import React from "react";
import "./styles.scss";
import FormContainer from "./FormContainer";
import Info from "./Info";

const AuthLayout = ({ image, title, description, render }) => {
  return (
    <div className="authLayout">
      <FormContainer render={render} />
      <Info title={title} description={description} image={image} />
    </div>
  );
};
export default AuthLayout;
