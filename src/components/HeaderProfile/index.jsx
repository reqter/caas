import React, { useState } from "react";
import { withRouter } from "react-router";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownItem from "reactstrap/lib/DropdownItem";
import storageManager from "services/storageManager";
import useGlobalState from "services/stateManager";
import { t } from "services/languageManager";
import { useLocale } from "hooks";
import "./styles.scss";

const HeaderProfile = ({ history }) => {
  const [
    { userInfo, isAuthenticated, spaceInfo, sysLocales },
    dispatch,
  ] = useGlobalState();
  const { currentLocale, setEditingLocale } = useLocale();
  const [dropDownVisibility, toggleVisibility] = useState(false);
  const [langVisibility, toggleLangVisibility] = useState(false);
  function toggle() {
    toggleVisibility((prevState) => !prevState);
  }
  function logout() {
    storageManager.removeItem("@caaser-token");
    dispatch({
      type: "LOGOUT",
      payload: false,
    });
    history.replace("/login");
  }

  function showProfile() {
    history.push("/panel/profile");
  }
  function showSettings() {
    history.push("/panel/settings");
  }
  function getLocaleTitle(localeName, type) {
    const locale = sysLocales.find((l) => l.name === localeName);
    if (locale !== undefined) return locale.title;
    return type === "name" ? "" : "none";
  }
  function setLang(item) {
    setEditingLocale(item.locale);
  }

  return (
    <div className="headerProfile">
      <div className="headerProfile__languages">
        <Dropdown
          isOpen={langVisibility}
          toggle={() => toggleLangVisibility((prevState) => !prevState)}
        >
          <DropdownToggle className="btn btn-light btn-sm">
            {getLocaleTitle(currentLocale)}&nbsp;
            <i className="icon-caret-down" />
          </DropdownToggle>
          <DropdownMenu>
            {spaceInfo.locales.map((item) => (
              <DropdownItem onClick={() => setLang(item)}>
                {getLocaleTitle(item.locale, "name")}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      {userInfo && userInfo.profile && userInfo.profile.avatar ? (
        userInfo.profile.avatar[currentLocale] ? (
          <div className="headerProfile__img" onClick={showProfile}>
            <img
              src={userInfo.profile.avatar[currentLocale].replace(
                "https://app-spanel.herokuapp.com",
                "https://assets.reqter.com"
              )}
              alt=""
            />
          </div>
        ) : (
          <div className="headerProfile__img" onClick={showProfile}>
            <img
              src={userInfo.profile.avatar
                .toString()
                .replace(
                  "https://app-spanel.herokuapp.com",
                  "https://assets.reqter.com"
                )}
              alt=""
            />
          </div>
        )
      ) : (
        <div className="headerProfile__noUserImg" onClick={showProfile}>
          <i className="icon-user" />
        </div>
      )}
      <span className="headerProfile__username" onClick={toggle}>
        {(!userInfo.profile.first_name ||
          userInfo.profile.first_name.length === 0) &&
        (!userInfo.profile.last_name || userInfo.profile.last_name.length)
          ? "Your Name"
          : userInfo.profile.first_name + " " + userInfo.profile.last_name}
      </span>
      <div className="headerProfile__actions">
        <Dropdown isOpen={dropDownVisibility} toggle={toggle}>
          <DropdownToggle className="btn btn-light btn-sm">
            <i className="icon-caret-down" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={showProfile}>
              {t("HOME_SIDEBAR_PROFILE_PROFILE")}
            </DropdownItem>
            <DropdownItem onClick={logout}>
              {t("HOME_SIDEBAR_PROFILE_LOGOUT")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default withRouter(HeaderProfile);
