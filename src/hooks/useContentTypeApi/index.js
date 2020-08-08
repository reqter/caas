import React from "react";
import useGlobalState from "services/stateManager";
import storageManager from "services/storageManager";
import { getContentTypes } from "Api/content-api";

const useContentTypeApi = () => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  function _getContentTypes(onSuccess, onError) {
    getContentTypes()
      .onOk((result) => {
        dispatch({
          type: "SET_CONTENT_TYPES",
          payload: result,
        });
        if (onSuccess) onSuccess(result);
      })
      .onServerError((result) => {
        if (onError) onError();
      })
      .onBadRequest((result) => {
        if (onError) onError();
      })
      .notFound((result) => {
        if (onError) onError();
      })
      .unAuthorized((result) => {
        storageManager.removeItem("@caaser-token");
        dispatch({
          type: "LOGOUT",
        });
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id);
  }
  return {
    _getContentTypes,
  };
};

export default useContentTypeApi;
