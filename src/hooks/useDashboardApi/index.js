import React from "react";
import useGlobalState from "services/stateManager";
import storageManager from "services/storageManager";
import {
  getStats,
  getContentsByStatus,
  getContentsStatusByContentType,
  getDailyInputs,
  getDailyInputsByCType,
  getAssetsByType,
} from "Api/dashboard";

const useDashboardApi = () => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const logOut = () => {
    storageManager.removeItem("@caaser-token");
    dispatch({
      type: "LOGOUT",
    });
  };
  function _getStats(onSuccess, onError) {
    getStats()
      .onOk((result) => {
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
        logOut();
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id);
  }
  function _getContentsByStatus(onSuccess, onError) {
    getContentsByStatus()
      .onOk((result) => {
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
        logOut();
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id);
  }
  function _getContentsStatusByCType(contentTypeId, onSuccess, onError) {
    getContentsStatusByContentType()
      .onOk((result) => {
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
        logOut();
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id, contentTypeId);
  }
  function _getDailyInputs(onSuccess, onError) {
    getDailyInputs()
      .onOk((result) => {
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
        logOut();
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id);
  }
  function _getDailyInputsByCType(contentTypeId, onSuccess, onError) {
    getDailyInputsByCType()
      .onOk((result) => {
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
        logOut();
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id, contentTypeId);
  }
  function _getAssetsByType(onSuccess, onError) {
    getAssetsByType()
      .onOk((result) => {
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
        logOut();
        if (onError) onError();
      })
      .unKnownError((result) => {
        if (onError) onError();
      })
      .call(spaceInfo.id);
  }
  return {
    _getStats,
    _getContentsByStatus,
    _getContentsStatusByCType,
    _getDailyInputs,
    _getDailyInputsByCType,
    _getAssetsByType,
  };
};

export default useDashboardApi;
