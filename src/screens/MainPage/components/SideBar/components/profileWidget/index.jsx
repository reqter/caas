import React, { useState } from "react";
import { withRouter } from "react-router";
import "./styles.scss";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownItem from "reactstrap/lib/DropdownItem";
import { languageManager, useGlobalState } from "services";
//
const ProfileWidget = props => {
  const { match, location, history } = props;
  const [{ userInfo, isAuthenticated }, dispatch] = useGlobalState();

  const [dropDownVisibility, toggleVisibility] = useState(false);
  function toggle() {
    toggleVisibility(prevState => !prevState);
  }
  function logout() {
    dispatch({
      type: "LOGOUT",
      value: false
    });
    history.replace("/login");
    postMessage(false);
  }

  function showProfile() {
    history.push("/panel/profile");
  }
  function showSettings() {
    history.push("/panel/settings");
  }
  return (
    <div className="profile-widget">
      {userInfo && userInfo.profile && userInfo.profile.avatar ? (
        <div className="userImage">
          <img src={userInfo.profile.avatar} alt="" />
        </div>
      ) : (
        <div className="left">
          <i className="icon-user" />
        </div>
      )}

      <div className="centerbox">
        {userInfo && (
          <>
            <span className="title">
              {(!userInfo.profile.first_name ||
                userInfo.profile.first_name.length === 0) &&
              (!userInfo.profile.last_name || userInfo.profile.last_name.length)
                ? "Your Name"
                : userInfo.profile.first_name +
                  " " +
                  userInfo.profile.last_name}
            </span>
            <span className="role">{userInfo.username}</span>
          </>
        )}
      </div>
      <div className="right">
        <Dropdown isOpen={dropDownVisibility} toggle={toggle}>
          <DropdownToggle className="btn btn-light btn-small">
            <i className="icon-more-h" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={showProfile}>
              {languageManager.translate("HOME_SIDEBAR_PROFILE_PROFILE")}
            </DropdownItem>
            <DropdownItem onClick={logout}>
              {languageManager.translate("HOME_SIDEBAR_PROFILE_LOGOUT")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
export default withRouter(ProfileWidget);
