import React from "react";
import "./styles.scss";
import LinkItem from "./linkItem";
import { languageManager } from "../../../../../../services";
const NavLinks = props => {
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

  return (
    <>
      <div className="sideLinksTitle">
        {languageManager.translate("HOME_NAVS_TITLE")}
      </div>
      <div className="sideLinks">
        {links.map(link => (
          <LinkItem link={link} key={link.path} />
        ))}
      </div>
    </>
  );
};

export default NavLinks;
