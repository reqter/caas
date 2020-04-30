import React from "react";
import useGlobalState from "services/stateManager";
import storageManager from "services/storageManager";
import useLocale from "hooks/useLocale";
import {
  getStats,
  getContentsByStatus,
  getContentsStatusByContentType,
  getDailyInputs,
  getDailyInputsByCType,
  getAssetsByType,
  getRecentAssets,
} from "Api/dashboard";

const useDashboardApi = () => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();
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

  function _getContentsByStatus(
    searchName,
    category,
    status,
    advanceFilterValues,
    dateRange,
    onSuccess,
    onError
  ) {
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
      .call(
        spaceInfo.id,
        searchName,
        category,
        status,
        advanceFilterValues,
        currentLocale,
        dateRange ? dateRange.name : undefined
      );
  }
  function _getContentsStatusByCType(
    searchName,
    contentTypeId,
    category,
    status,
    advanceFilterValues,
    dateRange,
    onSuccess,
    onError
  ) {
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
      .call(
        spaceInfo.id,
        searchName,
        contentTypeId,
        category,
        status,
        advanceFilterValues,
        currentLocale,
        dateRange.name
      );
  }
  //   ===========
  function _getDailyInputs(
    searchName,
    category,
    status,
    advanceFilterValues,
    dateRange,
    onSuccess,
    onError
  ) {
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
      .call(
        spaceInfo.id,
        searchName,
        category,
        status,
        advanceFilterValues,
        currentLocale,
        dateRange ? dateRange.name : undefined
      );
  }
  function _getDailyInputsByCType(
    searchName,
    contentTypeId,
    category,
    status,
    advanceFilterValues,
    dateRange,
    onSuccess,
    onError
  ) {
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
      .call(
        spaceInfo.id,
        searchName,
        contentTypeId,
        category,
        status,
        advanceFilterValues,
        currentLocale,
        dateRange.name
      );
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
  function _getRecentAssets(onSuccess, onError) {
    getRecentAssets()
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
    _getRecentAssets,
  };
};

export default useDashboardApi;
