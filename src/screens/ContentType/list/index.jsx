import React, { useState, useEffect } from "react";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import { languageManager, utility } from "services";

const List = props => {
  const currentLang = languageManager.getCurrentLanguage().name;
  const [selected, setSelected] = useState({});
  useEffect(() => {
    if (!props.rightContent) {
      setSelected({});
    }
  }, [props.rightContent]);
  return (
    <ListGroup>
      {props.data &&
        props.data.map(listItem => (
          <ListGroupItem
            key={listItem._id}
            className="listGroupItem"
            style={{
              backgroundColor: selected.sys
                ? selected._id === listItem._id
                  ? "lightgray"
                  : "white"
                : "white"
            }}
          >
            <div className="treeItem">
              {listItem.media === undefined || listItem.media.length === 0 ? (
                <div className="treeItem-icon">
                  <div className="contentIcon">
                    <i className="icon-item-type" />
                  </div>
                </div>
              ) : (
                <div className="treeItem-img">
                  <div className="treeItem-ext">
                    {utility.getAssetIconByURL(listItem.media[0][currentLang])}
                  </div>
                </div>
              )}
              <div className="treeItem-text">
                <span className="treeItem-name">
                  {listItem.title[currentLang]}
                </span>
                <span className="treeItem-desc">
                  {listItem.description[currentLang] ||
                    "Lorem ipsum dolor sit amet, consectetur"}
                </span>
              </div>
              {listItem.template !== "generic" && (
                <button
                  className="btn btn-light treeItem-action"
                  size="xs"
                  onClick={() => props.handleDeleteType(listItem)}
                >
                  <i className="icon-bin" />
                </button>
              )}
              <button
                className="btn btn-light treeItem-action"
                size="xs"
                onClick={() => props.handleEditType(listItem)}
              >
                <i className="icon-pencil" />
              </button>
              <button
                className="btn btn-light treeItem-action"
                size="xs"
                onClick={() => {
                  setSelected(listItem);
                  props.handleShowFields(listItem);
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {languageManager.translate("ITEM_TYPES_FIELDS")}
                </span>
              </button>
              <button
                className="btn btn-light treeItem-action"
                size="xs"
                onClick={() => {
                  props.onVisibleToClicked(listItem);
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {languageManager.translate("ITEM_TYPES_ACCESS_RIGHT")}
                </span>
              </button>
            </div>
          </ListGroupItem>
        ))}
    </ListGroup>
  );
};
export default List;
