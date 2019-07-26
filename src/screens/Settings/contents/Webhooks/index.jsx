import React, { useState, useEffect, useRef } from "react";
import { useGlobalState, languageManager } from "../../../../services";
import { getWebhooks, setWebhooks } from "../../../../Api/webhook-api";
import { CircleSpinner, Alert } from "../../../../components";

const Webhooks = props => {
  const [{ webhooks, spaceInfo }, dispatch] = useGlobalState();
  const [spinner, toggleSpinner] = useState(true);
  const [alertData, setAlertData] = useState();
  useEffect(() => {
    getWebhooks()
      .onOk(result => {
        toggleSpinner(false);
        dispatch({
          type: "SET_WEBHOOKS",
          value: result ? result : [],
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
      .requestError(result => {
        toggleSpinner(false);
      })
      .unKnownError(result => {
        toggleSpinner(false);
      })
      .call(spaceInfo.id);
  }, []);
  function remove(webhook) {
    const w = webhooks.filter(wh => wh.name !== webhook.name);
    setAlertData({
      type: "error",
      title: "Remove Webhook",
      message: "Are you sure to remove ?",
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () =>
        setWebhooks()
          .onOk(result => {
            setAlertData();
            dispatch({
              type: "SET_WEBHOOKS",
              value: w,
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
          .call(spaceInfo.id, w),
      onCancel: () => {
        setAlertData();
      },
    });
  }

  function edit(webhook) {
    props.onEditWebhook(webhook);
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
              Webhooks&nbsp;&nbsp;
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
                <th>Decription</th>
                <th>Type</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {webhooks.map((item, index) => {
                return (
                  <tr key={"webhook" + index}>
                    <td>
                      <div className="tdContent">
                        <div className="myTable-number">{index + 1}</div>
                      </div>
                    </td>
                    <td>
                      <div className="myTable-image-empty">empty</div>
                    </td>
                    <td>
                      <div className="tdContent bold">{item.name}</div>
                    </td>
                    <td>
                      <div className="tdContent">{item.description}</div>
                    </td>
                    <td>
                      <div className="tdContent">{item.type}</div>
                    </td>
                    <td>
                      <div className="myTable-actions tdContent">
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => remove(item)}
                        >
                          <i className="icon-bin" />
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => edit(item)}
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
export default Webhooks;
