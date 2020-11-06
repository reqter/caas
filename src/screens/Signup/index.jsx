import React, { useState } from "react";
import { t } from "services/languageManager";
import AuthLayout from "shared/layouts/AuthLayout";
import Registeration from "./signup";
import Success from "./success";
import SvgImage from "./svgImage";
import "./styles.scss";

const Signup = (props) => {
  const [tab, changeTab] = useState(2);
  const handleSignupSuccess = () => changeTab(2);
  return (
    <AuthLayout
      image={<SvgImage />}
      title={tab === 1 ? t("SIGNUP_TITLE") : t("SIGNUP_SUCCESS_TITLE")}
      description={
        tab === 1 ? t("SIGNUP_DESCRIPTION") : t("SIGNUP_SUCCESS_DESCRIPTION")
      }
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
