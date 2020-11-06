import React, { useState, useCallback, useMemo } from "react";
import { t } from "services/languageManager";
import "./styles.scss";
import AuthLayout from "shared/layouts/AuthLayout";
import ForgotPass from "./ForgotPass";
import VerifyCode from "./UserCode";
import ResetPassword from "./NewPass";
import Success from "./Success";
import SvgImage from "./svgImage";
import SvgImageSuccess from "./svgImageSuccess";

const ForgotPassword = (props) => {
  const [tab, changeTab] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleSuccessEmail = (email) => {
    setEmail(email);
    changeTab(2);
  };
  const handleSuccessVerifyCode = (token) => {
    setToken(token);
    changeTab(3);
  };
  const handleSuccessChangePassword = () => changeTab(4);
  const renderComponent = useCallback(() => {
    switch (tab) {
      case 1:
        return <ForgotPass onSuccessEmail={handleSuccessEmail} />;
      case 2:
        return (
          <VerifyCode
            email={email}
            onSuccessVerifyCode={handleSuccessVerifyCode}
          />
        );
      case 3:
        return (
          <ResetPassword
            token={token}
            onSuccessChangePassword={handleSuccessChangePassword}
          />
        );
      case 4:
        return <Success />;
      default:
    }
  }, [tab]);
  return (
    <AuthLayout
      image={tab === 4 ? <SvgImageSuccess /> : <SvgImage />}
      title={t("FORGOT_PASS_INFO_TITLE")}
      description={t("FORGOT_PASS_INFO_DESC")}
      render={renderComponent}
    />
  );
};
export default ForgotPassword;
