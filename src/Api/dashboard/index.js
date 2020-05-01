import storageManager from "services/storageManager";
import { makeDataParam, makeSearchFields } from "utils/makeGetDataUrlParams";
const baseUrl = process.env.REACT_APP_BASE_URL;
const getStats_url = baseUrl + "/spaces/stats";
const getContentsByStatus_url = baseUrl + "/contents/contentsbystatus";
const getContentsStatusByCType_url = baseUrl + "/contents/contentsbystatus";
const getDailyInputs_url = baseUrl + "/contents/dailyinputs";
const getDailyInputsByCType_url = baseUrl + "/contents/dailyinputs";
const getAssetsByType_url = baseUrl + "/assets/assetsbytype";
const getAssetsRecent_url = baseUrl + "/assets/getrecentitems?limit=5";
const getRecentContents_url = baseUrl + "/contents/recentitems?limit=5";

export function getStats() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (spaceId) => {
    try {
      const url = getStats_url;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {}
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}

export function getContentsByStatus() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (
    spaceId,
    name,
    category,
    contentStatus,
    advanceFilters = {},
    lang,
    dateRange
  ) => {
    try {
      const url = makeDataParam(
        getContentsByStatus_url,
        name,
        null,
        category,
        contentStatus,
        null,
        null,
        lang,
        dateRange
      );
      const search = advanceFilters ? makeSearchFields(advanceFilters) : {};
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          search,
        }),
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {}
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getContentsStatusByContentType() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (
    spaceId,
    name,
    contentType,
    category,
    contentStatus,
    advanceFilters = {},
    lang,
    dateRange
  ) => {
    try {
      const url = makeDataParam(
        getContentsStatusByCType_url,
        name,
        contentType,
        category,
        contentStatus,
        null,
        null,
        lang,
        dateRange
      );
      const search = makeSearchFields(advanceFilters);
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          search,
        }),
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {}
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getDailyInputs() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (
    spaceId,
    name,
    category,
    contentStatus,
    advanceFilters = {},
    lang,
    dateRange
  ) => {
    try {
      const url = makeDataParam(
        getDailyInputs_url,
        name,
        null,
        category,
        contentStatus,
        null,
        null,
        lang,
        dateRange
      );
      const search = advanceFilters ? makeSearchFields(advanceFilters) : {};
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          search,
        }),
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {}
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getDailyInputsByCType() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (
    spaceId,
    name,
    contentType,
    category,
    contentStatus,
    advanceFilters = {},
    lang,
    dateRange
  ) => {
    try {
      const url = makeDataParam(
        getDailyInputsByCType_url,
        name,
        contentType,
        category,
        contentStatus,
        null,
        null,
        lang,
        dateRange
      );
      const search = makeSearchFields(advanceFilters);
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          search,
        }),
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {}
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getAssetsByType() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (spaceId) => {
    try {
      const url = getAssetsByType_url;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {
      _unKnownError(error);
    }
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getRecentAssets() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (spaceId) => {
    try {
      const url = getAssetsRecent_url;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {
      _unKnownError(error);
    }
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getRecentContents() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = async (spaceId) => {
    try {
      const url = getRecentContents_url;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      switch (status) {
        case 200:
          _onOk(result);
          break;
        case 400:
          _onBadRequest();
          break;
        case 401:
          _unAuthorized();
          break;
        case 404:
          _notFound();
          break;
        case 500:
          _onServerError();
          break;
        default:
          _unKnownError(result);
          break;
      }
    } catch (error) {
      _unKnownError(error);
    }
  };

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
