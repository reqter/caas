import React from "react";
const Info = ({ title, description, image }) => {
  return (
    <div className="authLayout__right">
      <div className="authLayout__text">
        <h1 className="authLayout__title">{title}</h1>
        <h3 className="authLayout__desc">{description}</h3>
      </div>
      <div className="authLayout__img">{image}</div>
    </div>
  );
};
export default Info;
