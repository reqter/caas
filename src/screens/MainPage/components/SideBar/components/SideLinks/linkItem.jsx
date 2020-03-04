import React from "react";
import { NavLink  } from "react-router-dom";
const LinkItem = ({ link }) => {
  const icon = `linkIcon icon-${link.icon}`;
  return (
      <NavLink  to={link.path} className="linkItem" activeClassName="linkItemSelected">
      <div className="navIcon">
        <i className={icon} />
      </div>
      <div className="linkBody">
        <span className="linkText">{link.name}</span>
        <span className="linkTextDesc">{link.desc}</span>
      </div>
      </NavLink>
  );
};

export default LinkItem;
