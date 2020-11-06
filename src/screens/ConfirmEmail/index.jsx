import React, { useEffect } from "react";
import { t } from "services/languageManager";
import { confirmEmailFromURL } from "Api/account-api";
import AuthLayout from "shared/layouts/AuthLayout";
import Success from "./success";
import SvgImage from "./svgImage";
import "./styles.scss";

const ConfirmEmail = ({ match }) => {
  useEffect(() => {
    // if (match.params.token) confirmEmailFromURL().call(token);
  }, []);
  return (
    <AuthLayout
      image={<SvgImage />}
      title={t("CONFIRM_EMAIL_TITLE")}
      description={t("CONFIRM_EMAIL_DESCRIPTION")}
      render={() => <Success />}
    />
  );
};
export default ConfirmEmail;
