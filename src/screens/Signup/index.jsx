import React, { useState } from "react";
import { t } from "services/languageManager";
import AuthLayout from "shared/layouts/AuthLayout";
import Registeration from "./signup";
import Success from "./success";
import SvgImage from "./svgImage";
import "./styles.scss";

const Signup = (props) => {
  const [tab, changeTab] = useState(1);
  const handleSignupSuccess = () => changeTab(2);
  return (
    <AuthLayout
      image={<SvgImage />}
      title={t("SIGNUP_TITLE")}
      description={t("SIGNUP_DESCRIPTION")}
      render={() => {
        return tab === 1 ? (
          <Registeration onSuccessSignup={handleSignupSuccess} />
        ) : (
          <Success />
        );
      }}
    />
  );
};
export default Signup;
