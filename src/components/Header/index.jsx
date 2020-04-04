import React from "react";
import { languageManager } from "services";
import { NavLink } from "react-router-dom";
import Svg from "./svg";
import Logo from "./logo";
import HeaderProfile from "../HeaderProfile";
import "./styles.scss";

function translate(key) {
  return languageManager.translate(key);
}
const links = [
  {
    name: translate("HOME_SIDE_NAV_HOME"),
    icon: "home",
    path: "/panel/home",
    desc: translate("HOME_SIDE_NAV_HOME_DESC")
  },
  {
    name: translate("HOME_SIDE_NAV_CONTENT_TYPE"),
    icon: "item-type",
    path: "/panel/contentType",
    desc: translate("HOME_SIDE_NAV_CONTENT_TYPE_DEC")
  },
  {
    name: translate("HOME_SIDE_NAV_CONTENTS"),
    icon: "product",
    path: "/panel/contents",
    desc: translate("HOME_SIDE_NAV_CONTENTS_DESC")
  },
  {
    name: translate("HOME_SIDE_NAV_ASSETS_MANAGER"),
    icon: "images",
    path: "/panel/assets",
    desc: translate("HOME_SIDE_NAV_ASSETS_MANAGER_DESC")
  },
  {
    name: translate("HOME_SIDE_NAV_SETTINGS"),
    icon: "cog",
    path: "/panel/settings",
    desc: translate("HOME_SIDE_NAV_SETTINGS_DESC")
  }
];

const Header = () => {
  return (
    <div className="header">
      <div className="header__top">
        <div className="header__logo">
          <Logo />
        </div>
        <HeaderProfile />
      </div>
      <div className="header__bottom">
        <div className="header__content">
          {links.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="linkItem"
              activeClassName="linkItemSelected"
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
