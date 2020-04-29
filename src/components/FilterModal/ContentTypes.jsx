import React, { useEffect, useState, useRef } from "react";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import ContentTypeList from "./../ContentTypeList";

const ContentTypes = ({ onSelectContentType }) => {
  function handleClick(item) {
    if (onSelectContentType) onSelectContentType(item);
  }
  return (
    <ContentTypeList
      isLinkableName={false}
      renderActions={(contentType) => {
        return (
          <button
            className="btn btn-light btn-sm"
            onClick={() => handleClick(contentType)}
          >
            Select
          </button>
        );
      }}
    />
  );
};
export default ContentTypes;
