import React, { useState, useEffect } from "react";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import { languageManager, utility } from "services";
import { useLocale } from "hooks";
const currentLang = languageManager.getCurrentLanguage().name;

const List = props => {
  const [selected, setSelected] = useState({});
  const { currentLocale } = useLocale();
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
                    {utility.getAssetIconByURL(
                      listItem.media && listItem.media.length>0
                      ? listItem.media[0][currentLocale]
                        ? listItem.media[0][currentLocale].replace("https://app-spanel.herokuapp.com", "https://assets.reqter.com")
                        : listItem.media[0].toString().replace("https://app-spanel.herokuapp.com", "https://assets.reqter.com")
                      : null
                    )}
                  </div>
                </div>
              )}
              <div className="treeItem-text">
                <span className="treeItem-name">
                  {listItem.title && listItem.title[currentLocale]}
                </span>
                <span className="treeItem-desc">
                  {listItem.description && listItem.description[currentLocale]}
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
