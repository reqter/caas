import React, { useState, useEffect, useRef } from "react";
import { languageManager, useGlobalState } from "../../../services";
import { getContentTypes } from "./../../../Api/content-api";
import { CircleSpinner } from "../../../components";
const currentLang = languageManager.getCurrentLanguage().name;

const ContentTypes = props => {
  const [{ contentTypes, spaceInfo }, dispatch] = useGlobalState();
  const [spinner, togglepinner] = useState(true);
  function handleSelectContentType(contentType) {
    props.onSelectContentType(contentType);
  }
  function navigateToContentTypes() {
    props.history.push("/panel/contentType");
  }
  useEffect(() => {
    getContentTypes()
      .onOk(result => {
        togglepinner(false);
        dispatch({
          type: "SET_CONTENT_TYPES",
          value: result,
        });
        props.onEndLoading(true);
      })
      .onServerError(result => {
        togglepinner(false);
        const obj = {
          type: "ON_SERVER_ERROR",
          sender: "contentType",
          message: languageManager.translate("CONTENT_TYPE_ON_SERVER_ERROR"),
        };
        props.onEndLoading(false, obj);
      })
      .onBadRequest(result => {
        togglepinner(false);
        const obj = {
          type: "ON_SERVER_ERROR",
          sender: "contentType",
          message: languageManager.translate("CONTENT_TYPE_ON_BAD_REQUEST"),
        };
        props.onEndLoading(false, obj);
      })
      .unAuthorized(result => {
        togglepinner(false);
        const obj = {
          type: "ON_SERVER_ERROR",
          sender: "contentType",
          message: languageManager.translate("CONTENT_TYPE_UN_AUTHORIZED"),
        };
        props.onEndLoading(false, obj);
      })
      .call(spaceInfo.id);
  }, []);

  return spinner ? (
    <div className="contentTypesSpinner">
      <CircleSpinner show={spinner} size="large" />
      <span>Loading Content Types ...</span>
    </div>
  ) : !contentTypes || contentTypes.length === 0 ? (
    <div className="emptyContenType">
      <i className="icon-empty-box-open icon" />
      <span className="title">Empty List!</span>
      <span className="info">You have not created any content types yet.</span>
      <button
        className="btn btn-sm btn-primary"
        onClick={navigateToContentTypes}
      >
        New Content Type
      </button>
    </div>
  ) : (
    contentTypes.map(c => (
      <div key={c.id} className="listGroupItem">
        <div className="treeItem">
          {c.media === undefined || c.media.length === 0 ? (
            <div className="treeItem-icon">
              <div className="contentIcon">
                <i className="icon-item-type" />
              </div>
            </div>
          ) : (
            <div className="treeItem-img">
              <img src={c.media[0][currentLang]} alt="" />
            </div>
          )}
          <div className="treeItem-text">
            <span className="treeItem-name">{c.title[currentLang]}</span>
            <span className="treeItem-desc">
              {c.description[currentLang] ||
                "Lorem ipsum dolor sit amet, consectetur"}
            </span>
          </div>
          <button
            className="btn btn-light treeItem-action"
            size="xs"
            onClick={() => handleSelectContentType(c)}
          >
            <span style={{ fontSize: 12 }}>
              {languageManager.translate("Choose")}
            </span>
          </button>
        </div>
      </div>
    ))
  );
};
export default ContentTypes;
