import React from "react";
const Header = ({ selectedField, onTabChanged }) => {
  const [tab, toggleTab] = React.useState(1);
  const changeTab = (tabNumber) => {
    toggleTab(tabNumber);
    onTabChanged(tabNumber);
  };
  return (
    <div className="fieldConfig-header">
      <div className="left">
        <i
          className={
            selectedField.type === "string"
              ? "icon-file-text icon"
              : selectedField.type === "number"
              ? "icon-number icon"
              : selectedField.type === "dateTime"
              ? "icon-calendar icon"
              : selectedField.type === "location"
              ? "icon-location icon"
              : selectedField.type === "media"
              ? "icon-images icon"
              : selectedField.type === "jsonObject"
              ? "icon-json-file icon"
              : selectedField.type === "reference"
              ? "icon-reference icon"
              : selectedField.type === "boolean"
              ? "icon-boolean icon"
              : "icon-file-text icon"
          }
        />
        <span className="fieldName">{selectedField.name}</span>
        <span className="fieldType">{selectedField.type}</span>
      </div>
      <div className="right">
        <div
          className="tabItem"
          style={{
            background: tab === 1 ? "white" : "whitesmoke",
          }}
          onClick={() => changeTab(1)}
        >
          Settings
        </div>
        <div
          className="tabItem"
          style={{
            background: tab === 2 ? "white" : "whitesmoke",
          }}
          onClick={() => changeTab(2)}
        >
          Validations
        </div>
        <div
          className="tabItem"
          style={{
            background: tab === 3 ? "white" : "whitesmoke",
          }}
          onClick={() => changeTab(3)}
        >
          Appearance
        </div>
      </div>
    </div>
  );
};
export default Header;
