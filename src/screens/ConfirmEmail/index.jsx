import React, { useEffect } from "react";
import { t } from "services/languageManager";
import { confirmEmailFromURL } from "Api/account-api";
import AuthLayout from "components/AuthLayout";
import Success from "./success";
import SvgImage from "./svgImage";
import "./styles.scss";

const ConfirmEmail = () => {
  useEffect(() => {
    const token = "";
    confirmEmailFromURL().call(token);
  }, []);
  return (
    <AuthLayout
      image={<SvgImage />}
      title={t("CONFIRM_EMAIL_TITLE")}
      description={t("CONFIMR_EMAIL_DESCRIPTION")}
      render={() => <Success />}
    />
  );
};
export default ConfirmEmail;
