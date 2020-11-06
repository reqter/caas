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

const ForgotPassword = props => {
  const [tab, changeTab] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const getTitle = useMemo(() => {
    switch (tab) {
      case 1:
        return t("FORGOT_PASS_EMAIL_TITLE");
      case 2:
        return t("FORGOT_PASS_CODE_TITLE");
      case 3:
        return t("FORGOT_PASS_CHANGE_TITLE");
      case 4:
        return t("FORGOT_PASS_SUCCESS_TITLE");
      default:
    }
  });
  const getDescription = useMemo(() => {
    switch (tab) {
      case 1:
        return t("FORGOT_PASS_EMAIL_DESC");
      case 2:
        return t("FORGOT_PASS_CODE_DESC");
      case 3:
        return t("FORGOT_PASS_CHANGE_DESC");
      case 4:
        return t("FORGOT_PASS_SUCCESS_DESC");
      default:
    }
  });

  const handleSuccessEmail = email => {
    setEmail(email);
    changeTab(2);
  };
  const handleSuccessVerifyCode = token => {
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
      title={getTitle}
      description={getDescription}
      render={renderComponent}
    />
  );
};
export default ForgotPassword;
