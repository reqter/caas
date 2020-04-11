import React from "react";
import "./styles.scss";
const Loading = () => {
  return (
    <div className="lds-rippleWrapper">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <h6 style={{ textAlign: "center" }}>Please Wait...</h6>
    </div>
  );
};
export default Loading;
