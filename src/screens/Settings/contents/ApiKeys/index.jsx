import React, { useState, useEffect, useRef } from "react";
import { useGlobalState, languageManager } from "../../../../services";
import { getApiKeys, deleteApiKey } from "../../../../Api/apiKey-api";
import { CircleSpinner, Alert } from "../../../../components";

const currentLang = languageManager.getCurrentLanguage().name;
const ApiKeys = props => {
  const [{ apiKeys, spaceInfo }, dispatch] = useGlobalState();
  const [spinner, toggleSpinner] = useState(true);
  const [alertData, setAlertData] = useState();
  useEffect(() => {
    getApiKeys()
      .onOk(result => {
        toggleSpinner(false);
        dispatch({
          type: "SET_API_KEYS",
          value: result,
        });
      })
      .onServerError(result => {
        toggleSpinner(false);
      })
      .onBadRequest(result => {
        toggleSpinner(false);
      })
      .unAuthorized(result => {
        toggleSpinner(false);
      })
      .notFound(result => {
        toggleSpinner(false);
      })
      .call(spaceInfo.id);
  }, []);
  function remove(apiKey) {
    setAlertData({
      type: "error",
      title: "Remove Client ID",
      message: "Are you sure to remove ?",
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () =>
        deleteApiKey()
          .onOk(result => {
            setAlertData();
            dispatch({
              type: "DELETE_API_KEY",
              value: apiKey,
            });
          })
          .onServerError(result => {
            setAlertData();
          })
          .onBadRequest(result => {
            setAlertData();
          })
          .unAuthorized(result => {
            setAlertData();
          })
          .notFound(result => {
            setAlertData();
          })
          .call(spaceInfo.id, apiKey._id),
      onCancel: () => {
        setAlertData();
      },
    });
  }

  function edit(apiKey) {
    props.onEditApiKey(apiKey);
  }
  return (
    <>
      <div className="tabContents animated fadeIn faster">
        <div className="tabContent">
          <div className="tabContent-header">
            <span
              className="tabContent-header-title"
              style={{ display: "flex", alignItems: "center" }}
            >
              Connected Apps&nbsp;&nbsp;
              <CircleSpinner show={spinner} size="small" />
            </span>
            <span className="tabContent-header-desc">
              Lorem ipsum has no many contribute
            </span>
          </div>
          <table className="table myTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Icon</th>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Client ID</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey, index) => {
                return (
                  <tr key={"apiKey" + index}>
                    <td>
                      <div className="tdContent">
                        <div className="myTable-number">{index + 1}</div>
                      </div>
                    </td>
                    <td>
                      {apiKey.icon && apiKey.icon.length > 0 ? (
                        <div className="myTable-image">
                          <img src={apiKey.icon} alt="" />
                        </div>
                      ) : (
                        <div className="myTable-image-empty">empty</div>
                      )}
                    </td>
                    <td>
                      <div className="tdContent bold">{apiKey.name}</div>
                    </td>
                    <td>
                      <div className="tdContent">{apiKey.description}</div>
                    </td>
                    <td>
                      <div className="tdContent">{apiKey.type}</div>
                    </td>
                    <td>
                      <div className="tdContent">{apiKey.clientId}</div>
                    </td>
                    <td>
                      <div className="myTable-actions tdContent">
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => remove(apiKey)}
                        >
                          <i className="icon-bin" />
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => edit(apiKey)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {alertData && <Alert data={alertData} />}
    </>
  );
};
export default ApiKeys;
