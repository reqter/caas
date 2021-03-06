import { storageManager } from "services";
const config = process.env;
const baseUrl = config.REACT_APP_ASSET_BASE_URL;
const setLocalesURL = baseUrl + config.REACT_APP_SPACE_SET_LOCALES;
const setRolesURL = baseUrl + config.REACT_APP_SPACE_SET_ROLES;

export function updateSpace() {
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
  const _call = async (oldPass, newPass) => {
    try {
      const status = 200;
      const result = {};

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
      _onServerError();
    }
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onConnectionError: function(callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    }
  };
}

export function setLocales() {
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
  const _call = async (spaceId, locales) => {
    try {
      const url = setLocalesURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: spaceId,
          locales: locales
        })
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
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onConnectionError: function(callback) {
      _onConnectionErrorCallBack = callback;
      return this;
    }
  };
}
export function setRoles() {
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
  const _call = async (spaceId, roles) => {
    try {
      const url = setRolesURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: spaceId,
          roles: roles
        })
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      if (status === 200) {
        _onOk(result);
      } else _unKnownError();

      // switch (status) {
      //   case 200:
      //     _onOk(result);
      //     break;
      //   case 400:
      //     _onBadRequest();
      //     break;
      //   case 401:
      //     _unAuthorized();
      //     break;
      //   case 404:
      //     _notFound();
      //     break;
      //   case 500:
      //     _onServerError();
      //     break;
      //   default:
      //     break;
      //}
    } catch (error) {
      _unKnownError();
    }
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}

export function setUsers() {
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
  const _call = async (spaceId, users) => {
    try {
      _onOk(users);
      return;
      const url = setRolesURL;
      const token = storageManager.getItem("@caaser-token");
      var rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: spaceId,
          users: users
        })
      });
      const status = rawResponse.status;
      const result = await rawResponse.json();
      if (status === 200) {
        _onOk(result);
      } else _unKnownError();

      // switch (status) {
      //   case 200:
      //     _onOk(result);
      //     break;
      //   case 400:
      //     _onBadRequest();
      //     break;
      //   case 401:
      //     _unAuthorized();
      //     break;
      //   case 404:
      //     _notFound();
      //     break;
      //   case 500:
      //     _onServerError();
      //     break;
      //   default:
      //     break;
      //}
    } catch (error) {
      _unKnownError();
    }
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
