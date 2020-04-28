import { languageManager, storageManager } from "./../../services";
const config = process.env;
// const getAllURL =
//   config.REACT_APP_CONTENT_TYPE_BASE_URL + config.REACT_APP_CONTENT_TYPE_GET_ALL
const baseUrl = config.REACT_APP_CONTENTS_BASE_URL;
const getAllURL = baseUrl + config.REACT_APP_CONTENTS_GET_ALL;
const getByIdURL = baseUrl + config.REACT_APP_CONTENTS_GET_BY_ID;
const getByIdLINK = baseUrl + config.REACT_APP_CONTENTS_GET_BY_LINK;
const filterURL = baseUrl + "/contents/filter";
const filterURLByRels = baseUrl + "/contents/filterbyrels";
const filter_new_url = baseUrl + "/contents/search";

const addURL = baseUrl + config.REACT_APP_CONTENTS_ADD;
const updateURL = baseUrl + config.REACT_APP_CONTENTS_UPDATE;
const updatePublishURL = baseUrl + "/contents/partialupdate";

const deleteURL = baseUrl + config.REACT_APP_CONTENTS_DELETE;
const archiveURL = baseUrl + config.REACT_APP_CONTENTS_ARCHIVE;
const unArchiveURL = baseUrl + config.REACT_APP_CONTENTS_UN_ARCHIVE;
const publishURL = baseUrl + config.REACT_APP_CONTENTS_PUBLISH;
const unPublishURL = baseUrl + config.REACT_APP_CONTENTS_UN_PUBLISH;

const getContentTypesURL =
  config.REACT_APP_CONTENT_TYPE_BASE_URL +
  config.REACT_APP_CONTENT_TYPE_GET_ALL;
const getContentTypeByIdURL =
  config.REACT_APP_CONTENT_TYPE_BASE_URL + "/ctypes/getbyid";
const getCategoriesURL =
  config.REACT_APP_CATEGORIES_BASE_URL + config.REACT_APP_CATEGORIES_GET_ALL;

const data = require("./../data.json");

export function filterContents_old() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (
    spaceId,
    name,
    contentType,
    category,
    contentStatus,
    skip,
    limit
  ) => {
    try {
      let url = filterURL + "?";
      if (contentType) url = url + "contentType=" + contentType;

      if (url[url.length - 1] !== "?") url = url + "&";

      if (category) url = url + "category=" + category;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }

      if (contentStatus) url = url + "status=" + contentStatus;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }

      if (name && name.length > 0) url = url + "name=" + name;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }
      if (skip || skip === 0) url = url + "skip=" + skip;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }

      if (limit) url = url + "limit=" + limit;

      if (url[url.length - 1] === "?") url = url.substring(0, url.length - 1);

      if (url[url.length - 1] === "&") url = url.substring(0, url.length - 1);
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}

export function filterContents() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (
    spaceId,
    name,
    contentType,
    category,
    contentStatus,
    skip,
    limit,
    advanceFilters = {}
  ) => {
    try {
      let url = filter_new_url + "?";
      if (contentType) url = url + "contentType=" + contentType;

      if (url[url.length - 1] !== "?") url = url + "&";

      if (category) url = url + "category=" + category;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }

      if (contentStatus) url = url + "status=" + contentStatus;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }

      if (name && name.length > 0) url = url + "name=" + name;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }
      if (skip || skip === 0) url = url + "skip=" + skip;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }
      if (limit) url = url + "limit=" + limit;

      if (url[url.length - 1] !== "?" && url[url.length - 1] !== "&") {
        url = url + "&";
      }

      if (url[url.length - 1] === "?") url = url.substring(0, url.length - 1);

      if (url[url.length - 1] === "&") url = url.substring(0, url.length - 1);

      const searchArray = Object.keys(advanceFilters);
      const search = searchArray.reduce((obj, key) => {
        if (advanceFilters[key] && advanceFilters[key].length > 0) {
          obj["fields." + key] = advanceFilters[key];
        }
        // obj = url + `field.${key}:${advanceFilters[key]}`;
        return obj;
      }, {});

      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceid: spaceId,
        },
        body: JSON.stringify({
          search: search,
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
          break;
      }
    } catch (error) {
      console.log(error);
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function getByContentTypes() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  function _call(contentTypes = []) {
    let result = [];
    if (contentTypes.length === 0) {
      result = data.contents;
    } else {
      for (let i = 0; i < contentTypes.length; i++) {
        const contentTypeId = contentTypes[i];
        for (let j = 0; j < data.contents.length; j++) {
          const content = data.contents[i];
          if (content.contentType.id === contentTypeId) {
            result.push(content);
            break;
          }
        }
      }
    }
    const status = 200;
    switch (status) {
      case 200:
        _onOk(result);
        break;
      case 400:
        _onBadRequest(result);
        break;
      case 401:
        _unAuthorized(result);
        break;
      case 404:
        _notFound(result);
        break;
      case 500:
        _onServerError(result);
        break;
      default:
        break;
    }
  }

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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function getContents() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId) => {
    try {
      const url = getAllURL;
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function getContentTypes() {
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
      const url = getContentTypesURL;
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
export function getCategories() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId) => {
    try {
      const url = getCategoriesURL;
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function addContent() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, content) => {
    try {
      const url = addURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceid: spaceId,
        },
        body: JSON.stringify(content),
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function updateContent() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, content) => {
    try {
      const url = updateURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: content._id,
          contentType: content.contentType,
          category: content.category,
          fields: content.fields,
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function update_PublishContent() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, content) => {
    try {
      const url = updatePublishURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: content._id,
          contentType: content.contentType,
          category: content.category,
          fields: content.fields,
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function deleteContent() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, contentId) => {
    try {
      const url = deleteURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "DELETE",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: contentId,
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
          break;
      }
    } catch (error) {
      debugger;
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function getContentById() {
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
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = async (spaceId, contentId) => {
    try {
      const url = getByIdURL + "?id=" + contentId;
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
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getContentTypeById() {
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
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = async (spaceId, contentTypeId) => {
    try {
      const url = getContentTypeByIdURL + "?id=" + contentTypeId;
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
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}

export function getContentByLink() {
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
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = async (link) => {
    try {
      const url = getByIdLINK + "?link=" + link;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
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
          _unKnownError();
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
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function publish() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, assetId) => {
    try {
      const url = publishURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: assetId,
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function unPublish() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, contentId) => {
    try {
      const url = unPublishURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: contentId,
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
          break;
      }
    } catch (error) {
      _onServerError(error);
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function archive() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, contentId) => {
    try {
      const url = archiveURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: contentId,
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
export function unArchive() {
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
  let _onConnectionErrorCallBack;
  function _onConnectionError(result) {
    if (_onConnectionErrorCallBack) {
      _onConnectionErrorCallBack(result);
    }
  }
  const _call = async (spaceId, contentId) => {
    try {
      const url = unArchiveURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
          spaceId: spaceId,
        },
        body: JSON.stringify({
          id: contentId,
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
          break;
      }
    } catch (error) {
      _onServerError(error);
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
    onConnectionError: function (callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    },
  };
}
