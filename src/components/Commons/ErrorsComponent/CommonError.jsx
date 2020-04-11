import React from "react";
import "./styles.scss";
const CommonError = ({ text = "" }) => {
  return <div className="commonError">{text}</div>;
};
export default CommonError;
