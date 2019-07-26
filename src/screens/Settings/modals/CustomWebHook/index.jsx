import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalFooter } from "reactstrap";
import { CircleSpinner } from "../../../../components";
import { languageManager, useGlobalState } from "../../../../services";
import "./styles.scss";
import { setWebhooks } from "../../../../Api/webhook-api";
const util = require("util");
const currentLang = languageManager.getCurrentLanguage().name;
const triggersEntity = [
  {
    name: "content",
    title: {
      en: "Content",
    },
  },
  {
    name: "asset",
    title: {
      en: "Asset",
    },
  },
];
const authTypes = [
  {
    name: "none",
    title: "None",
  },
  {
    name: "basic",
    title: "Basic",
  },
  {
    name: "bearer",
    title: "Bearer Tokean",
  },
  {
    name: "apiKey",
    title: "Api Key",
  },
];

const CustomWebHook = props => {
  const [{ spaceInfo, userInfo, webhooks }, dispatch] = useGlobalState();
  const nameRef = useRef(null);

  const updateMode = props.selectedWebhook ? true : false;
  const selectedWebhook = props.selectedWebhook
    ? props.selctedWebhook
    : undefined;

  const [spinner, toggleSpinner] = useState(false);
  const [tab, changeTab] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [urlMethod, setUrlMethod] = useState("POST");

  const [triggerType, setTriggerType] = useState("all");
  const [customTriggers, setCustomTriggers] = useState({});

  const [headerBox, toggleHeaderBox] = useState(1);
  const [customHeaders, setCustomHeaders] = useState([{ key: "", value: "" }]);
  const [secretHeaders, setSecretHeaders] = useState([{}]);
  const [headerContentType, setHeaderContentType] = useState(
    "application/json"
  );
  const [headerContentLength, toggleHeaderContentLength] = useState();

  const [authType, setAuthType] = useState("none");
  const [basicUserName, setBasicUserName] = useState("");
  const [basicPassword, setBasicPassword] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const [payloadType, setPayLoadType] = useState("default");
  const [customPayloadObj, setCustomPayloadObj] = useState("");
  const [jsonError, setJsonError] = useState();

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  function handleChangeTab(tabNum) {
    if (tab !== tabNum) {
      changeTab(tabNum);
      if (tab === 1) nameRef.current.focus();
    }
  }
  function handleChangeTrigger(e) {
    setTriggerType(e.target.value);
  }
  function handleChangePayload(e) {
    setPayLoadType(e.target.value);
  }
  function closeModal() {
    props.onClose();
  }
  function handleCustomTriggerChanged(item, key, value) {
    const t = { ...customTriggers };
    if (t[item] === undefined) t[item] = {};

    t[item][key] = value;
    setCustomTriggers(t);
  }
  function showNotify(type, msg) {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: type,
        message: msg,
      },
    });
  }
  function handleRemoveCustomHeader(i) {
    if (customHeaders.length > 1) {
      const c_h = customHeaders.filter((item, index) => index !== i);
      setCustomHeaders(c_h);
    }
  }
  function addNewCustomHeader() {
    const c_h = [...customHeaders];
    const obj = { key: "", value: "" };
    c_h.push(obj);
    setCustomHeaders(c_h);
  }
  function handleCustomHeaderInputsChanged(index, key, value) {
    let c_h = [...customHeaders];
    c_h[index][key] = value;
    setCustomHeaders(c_h);
  }
  function handleRemoveSecretHeader(i) {
    if (secretHeaders.length > 1) {
      const c_h = secretHeaders.filter((item, index) => index !== i);
      setSecretHeaders(c_h);
    }
  }
  function addNewSecretHeader() {
    const c_h = [...secretHeaders];
    const obj = { key: "", value: "" };
    c_h.push(obj);
    setSecretHeaders(c_h);
  }
  function handleSecretHeaderInputsChanged(index, key, value) {
    let s_h = [...secretHeaders];
    s_h[index][key] = value;
    setSecretHeaders(s_h);
  }
  function handlePayloadJson(e) {
    let p;
    setCustomPayloadObj(e.target.value);
    try {
      p = JSON.parse(e.target.value);
      if (jsonError) setJsonError();
    } catch (error) {
      setJsonError(util.inspect(error));
    }
  }
  function checkValidations() {
    if (authType === "basic") {
      if (basicUserName.length === 0 || basicPassword.length === 0) {
        showNotify(
          "error",
          " Basic authentication needs valid username and password"
        );
        changeTab(4);
        return false;
      }
    }
    if (authType === "bearer") {
      if (bearerToken.length === 0) {
        changeTab(4);
        showNotify("error", "Bearer token can not be empty.");
      }
      return false;
    }
    if (authType === "apiKey") {
      if (apiKey.length === 0 || apiSecret.length === 0) {
        changeTab(4);
        showNotify("error", "Api key and api secret can not be empty");
      }
      return false;
    }
    if (payloadType === "custom" && customPayloadObj.length === 0) {
      changeTab(5);
      showNotify("error", "Please enter a valid payload object");
      return false;
    }
    return true;
  }
  function submit(e) {
    e.preventDefault();
    if (!spinner) {
      const isValid = checkValidations();
      if (isValid) {
        toggleSpinner(true);
        let w = [...webhooks];
        let obj = {
          name: name,
          description: description,
          type: "custom",
          sys: {
            issuer: userInfo.id,
            issueData: new Date(),
            //lastUpdater: userInfo,
          },
          config: {
            method: urlMethod,
            url: url,
            trigger: triggerType === "all" ? null : customTriggers,
            customHeaders: customHeaders.reduce((acc, obj, i) => {
              acc[obj["key"]] = obj["value"];
              return acc;
            }, {}),
            secretHeaders: secretHeaders.reduce((acc, obj, i) => {
              acc[obj["key"]] = obj["value"];
              return acc;
            }, {}),
            contentType: headerContentType,
            contentLength: headerContentLength,
            authentication: {
              type: authType,
              basicAuth:
                authType === "basic"
                  ? {
                      username: basicUserName,
                      password: basicPassword,
                    }
                  : null,
              bearerToken: authType === "bearer" ? bearerToken : null,
              apiKey:
                authType === "apiKey"
                  ? {
                      apiKey: apiKey,
                      apiSecret: apiSecret,
                    }
                  : null,
            },
            payload:
              payloadType === "default" ? null : JSON.parse(customPayloadObj),
          },
        };
        if (updateMode) {
          obj["sys"]["lastUpdateTime"] = new Date();
          for (let i = 0; i < w.length; i++) {
            let w_h = w[i];
            if (w_h.name === name) {
              w_h = obj;
            }
          }
        } else w.push(obj);
        setWebhooks()
          .onOk(result => {
            showNotify(
              "success",
              languageManager.translate("Custom webhook created successfully")
            );
            const w = [...webhooks];
            w.push(result);
            dispatch({
              type: "SET_WEBHOOKS",
              value: w,
            });
          })
          .onServerError(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_ON_SERVER_ERROR")
            );
          })
          .onBadRequest(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_ON_BAD_REQUEST")
            );
          })
          .unAuthorized(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_UN_AUTHORIZED")
            );
          })
          .notFound(result => {
            toggleSpinner(false);
            showNotify(
              "error",
              languageManager.translate("PROFILE_CHANGE_PASS_NOT_FOUND")
            );
          })
          .call(spaceInfo.id, w);
      }
    }
  }
  return (
    <Modal isOpen={props.isOpen} toggle={closeModal} size="lg">
      <div className="custoWebhook">
        <div className="customWebhook-header">
          <div className="leftSide">
            <span>Custom Webhook</span>
          </div>
          <div className="rightSide">
            <div className="webhhookTabs">
              <div
                className={"webhookTabItem " + (tab === 1 ? "active" : "")}
                onClick={() => handleChangeTab(1)}
              >
                Detail
              </div>
              <div
                className={"webhookTabItem " + (tab === 2 ? "active" : "")}
                onClick={() => handleChangeTab(2)}
              >
                Triggers
              </div>
              <div
                className={"webhookTabItem " + (tab === 3 ? "active" : "")}
                onClick={() => handleChangeTab(3)}
              >
                Headers
              </div>
              <div
                className={"webhookTabItem " + (tab === 4 ? "active" : "")}
                onClick={() => handleChangeTab(4)}
              >
                Authentication
              </div>
              <div
                className={"webhookTabItem " + (tab === 5 ? "active" : "")}
                onClick={() => handleChangeTab(5)}
              >
                PayLoad
              </div>
            </div>
          </div>
        </div>
        <div className="customWebhook-body">
          {tab === 1 && (
            <>
              <div className="row">
                <div className="form-group col">
                  <label>{languageManager.translate("Name")}</label>
                  <input
                    type="text"
                    ref={nameRef}
                    className="form-control"
                    placeholder={languageManager.translate("Enter a name")}
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                    }}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("Name is required ")}
                  </small>
                </div>
                <div className="form-group col">
                  <label>{languageManager.translate("Description")}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={languageManager.translate(
                      "Enter a short description"
                    )}
                    value={description}
                    onChange={e => {
                      setDescription(e.target.value);
                    }}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("Name is required ")}
                  </small>
                </div>
              </div>
              <div className="form-group">
                <label>{languageManager.translate("Webservice URL")}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={languageManager.translate(
                    "Enter a webservice url"
                  )}
                  value={url}
                  onChange={e => {
                    setUrl(e.target.value);
                  }}
                />
                <small className="form-text text-muted">
                  {languageManager.translate("URL is required ")}
                </small>
              </div>
              <div className="urlMethods">
                <label>{languageManager.translate("Method Type")}</label>
                <div className="urlMethods-btns">
                  <button
                    className={
                      "btn btn-sm " +
                      (urlMethod === "POST" ? "btn-primary" : "btn-light")
                    }
                    onClick={() => setUrlMethod("POST")}
                  >
                    POST
                  </button>
                  <button
                    className={
                      "btn " +
                      (urlMethod === "GET" ? "btn-primary" : "btn-light")
                    }
                    onClick={() => setUrlMethod("GET")}
                  >
                    GET
                  </button>
                  <button
                    className={
                      "btn " +
                      (urlMethod === "PUT" ? "btn-primary" : "btn-light")
                    }
                    onClick={() => setUrlMethod("PUT")}
                  >
                    PUT
                  </button>
                  <button
                    className={
                      "btn " +
                      (urlMethod === "PATCH" ? "btn-primary" : "btn-light")
                    }
                    onClick={() => setUrlMethod("PATCH")}
                  >
                    PATCH
                  </button>
                  <button
                    className={
                      "btn " +
                      (urlMethod === "DELETE" ? "btn-primary" : "btn-light")
                    }
                    onClick={() => setUrlMethod("DELETE")}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </>
          )}
          {tab === 2 && (
            <>
              <div className="triggerType">
                <div className="title">
                  Specify for what kind of events this webhook should be
                  triggered.
                </div>
              </div>
              <div className="custom_checkbox ">
                <div className="left">
                  <label className="radio">
                    <input
                      type="radio"
                      value="all"
                      checked={triggerType === "all"}
                      name="triggerType"
                      onChange={handleChangeTrigger}
                      id="allEvent"
                    />
                    <span className="checkround" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="allEvent">Trigger for all events</label>
                  <label htmlFor="allEvent">
                    Select this if there is only one thing to store For
                  </label>
                </div>
              </div>
              <div className="custom_checkbox ">
                <div className="left">
                  <label className="radio">
                    <input
                      type="radio"
                      value="custom"
                      checked={triggerType === "custom"}
                      name="triggerType"
                      onChange={handleChangeTrigger}
                      id="customEvents"
                    />
                    <span className="checkround" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="customEvents">
                    Select specific triggering events
                  </label>
                  <label htmlFor="customEvents">
                    example, a single photo or one PDF file
                  </label>
                </div>
              </div>
              {triggerType === "custom" && (
                <div className="customTriggerEvents">
                  <table className="table">
                    <thead>
                      <tr>
                        <th />
                        <th>Create</th>
                        <th>Save</th>
                        <th>Archive</th>
                        <th>Unarchive</th>
                        <th>Publish</th>
                        <th>Unpublish</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {triggersEntity.map(item => (
                        <tr key={item.name}>
                          <td>
                            <div className="title">
                              {item.title[currentLang]}
                            </div>
                          </td>
                          {[
                            "create",
                            "save",
                            "archive",
                            "unArchive",
                            "publish",
                            "unPublish",
                            "delete",
                          ].map(t => (
                            <td key={t}>
                              <div className="chk">
                                <div className="custom_checkbox">
                                  <div className="left">
                                    <label className="checkBox">
                                      <input
                                        type="checkbox"
                                        checked={
                                          customTriggers[item.name]
                                            ? customTriggers[item.name][t]
                                            : false
                                        }
                                        onChange={e =>
                                          handleCustomTriggerChanged(
                                            item.name,
                                            t,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <span className="checkmark" />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {tab === 3 && (
            <>
              <div className="customWebhook-filters">
                <div
                  className="customWebhook-filters-header"
                  onClick={() => {
                    if (headerBox !== 1) toggleHeaderBox(1);
                    else toggleHeaderBox();
                  }}
                >
                  <div className="filters-title">Custom Header</div>
                  <div className="filters-message">
                    This webhook will trigger only for entities matching the
                  </div>
                  <span
                    className={
                      "icon icon-caret-" + (headerBox === 1 ? "up" : "down")
                    }
                  />
                </div>
                {headerBox === 1 && (
                  <div className="filter-content">
                    {customHeaders.map((item, index) => (
                      <div className="options" key={index}>
                        <div className="leftInput">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="key"
                            value={item["key"]}
                            onChange={e =>
                              handleCustomHeaderInputsChanged(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="centerInput">
                          <input
                            type="text"
                            placeholder="value"
                            className="form-control"
                            value={item["value"]}
                            onChange={e =>
                              handleCustomHeaderInputsChanged(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="rightInput">
                          <button
                            className="btn btn-light"
                            onClick={() => handleRemoveCustomHeader(index)}
                          >
                            <i className="icon-bin" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-primary btn-plus btn-sm"
                      onClick={addNewCustomHeader}
                    >
                      <i className="icon-plus" />
                    </button>
                  </div>
                )}
              </div>
              <div className="customWebhook-filters">
                <div
                  className="customWebhook-filters-header"
                  onClick={() => {
                    if (headerBox !== 2) toggleHeaderBox(2);
                    else toggleHeaderBox();
                  }}
                >
                  <div className="filters-title">Secret Header</div>
                  <div className="filters-message">
                    This webhook will trigger only for entities matching the
                  </div>
                  <span
                    className={
                      "icon icon-caret-" + (headerBox === 2 ? "up" : "down")
                    }
                  />
                </div>
                {headerBox === 2 && (
                  <div className="filter-content">
                    {secretHeaders.map((item, index) => (
                      <div className="options" key={index}>
                        <div className="leftInput">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="key"
                            value={item["key"]}
                            onChange={e =>
                              handleSecretHeaderInputsChanged(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="centerInput">
                          <input
                            type="text"
                            placeholder="value"
                            className="form-control"
                            value={item["value"]}
                            onChange={e =>
                              handleSecretHeaderInputsChanged(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="rightInput">
                          <button
                            className="btn btn-light"
                            onClick={() => handleRemoveSecretHeader(index)}
                          >
                            <i className="icon-bin" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-primary btn-plus btn-sm"
                      onClick={addNewSecretHeader}
                    >
                      <i className="icon-plus" />
                    </button>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="headerContentType col">
                  <div className="form-group">
                    <label>{languageManager.translate("Content Type")}</label>
                    <select
                      className="form-control"
                      value={headerContentType}
                      onChange={e => setHeaderContentType(e.target.value)}
                    >
                      <option value="application/json">application/json</option>
                      <option value="application/json;charset=utf-8">
                        application/json; charset=utf-8
                      </option>
                      <option value="application/x-www-form-urlencoded">
                        application/x-www-form-urlencoded
                      </option>
                      <option value="application/x-www-form-urlencoded;charset=utf-8">
                        application/x-www-form-urlencoded; charset=utf-8
                      </option>
                    </select>
                    <small className="form-text text-muted">
                      {languageManager.translate(
                        "Select one of allowed MIME types to be used as the value of the Content-Type header. Any custom Content-Type header will be ignored."
                      )}
                    </small>
                  </div>
                </div>
                <div className="col" style={{ paddingTop: 40 }}>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="checkBox">
                        <input
                          type="checkbox"
                          id="contentLength"
                          checked={headerContentLength}
                          onChange={e =>
                            toggleHeaderContentLength(e.target.checked)
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="contentLength">
                        {languageManager.translate("Content Length")}
                      </label>
                      <label htmlFor="contentLength">
                        {languageManager.translate(
                          "If this option is selected, the byte size of the final request body will be computed and used as the value of the Content-Length header."
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {tab === 4 && (
            <>
              <div className="urlMethods">
                <label>
                  {languageManager.translate("Authentication type")}
                </label>
                <div className="urlMethods-btns">
                  {authTypes.map(item => (
                    <button
                      key={item.name}
                      className={
                        "btn btn-sm " +
                        (authType === item.name ? "btn-primary" : "btn-light")
                      }
                      onClick={() => setAuthType(item.name)}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
              <br />
              {authType === "apiKey" && (
                <>
                  <label> Api Key</label>
                  <div className="row">
                    <div className="form-group col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={languageManager.translate(
                          "enter your api key"
                        )}
                        value={apiKey}
                        onChange={e => {
                          setApiKey(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        {languageManager.translate("Api key is required")}
                      </small>
                    </div>
                    <div className="form-group col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={languageManager.translate(
                          "enter your api secret"
                        )}
                        value={apiSecret}
                        onChange={e => {
                          setApiSecret(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        {languageManager.translate("Api secret is required")}
                      </small>
                    </div>
                  </div>
                </>
              )}
              {authType === "bearer" && (
                <>
                  <label> Bearer Token</label>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder={languageManager.translate(
                        "enter your token"
                      )}
                      value={bearerToken}
                      onChange={e => {
                        setBearerToken(e.target.value);
                      }}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate("Token is required")}
                    </small>
                  </div>
                </>
              )}
              {authType === "basic" && (
                <>
                  <label> HTTP Basic Auth Header</label>
                  <div className="row">
                    <div className="form-group col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={languageManager.translate("Username")}
                        required
                        value={basicUserName}
                        onChange={e => {
                          setBasicUserName(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        {languageManager.translate("auth header username")}
                      </small>
                    </div>
                    <div className="form-group col">
                      <input
                        type="password"
                        className="form-control"
                        placeholder={languageManager.translate("Password")}
                        required
                        value={basicPassword}
                        onChange={e => {
                          setBasicPassword(e.target.value);
                        }}
                      />
                      <small className="form-text text-muted">
                        {languageManager.translate("auth header password")}
                      </small>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {tab === 5 && (
            <>
              <div className="triggerType">
                <div className="title">
                  You can customize the webhook payload to match the format
                  expected by the service your webhook calls
                </div>
              </div>
              <div className="custom_checkbox ">
                <div className="left">
                  <label className="radio">
                    <input
                      type="radio"
                      value="default"
                      checked={payloadType === "default"}
                      name="payloadType"
                      onChange={handleChangePayload}
                      id="defaultPayLoad"
                    />
                    <span className="checkround" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="defaultPayLoad">Use default payload</label>
                  <label htmlFor="defaultPayLoad">
                    Select this if there is only one thing to store For
                  </label>
                </div>
              </div>
              <div className="custom_checkbox">
                <div className="left">
                  <label className="radio">
                    <input
                      type="radio"
                      value="custom"
                      checked={payloadType === "custom"}
                      name="payloadType"
                      onChange={handleChangePayload}
                      id="customPayload"
                    />
                    <span className="checkround" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="customPayload">
                    Customize the webhook payload
                  </label>
                  <label htmlFor="customPayload">
                    example, a single photo or one PDF file
                  </label>
                </div>
              </div>
              {payloadType === "custom" && (
                <div className="form-group" style={{ marginTop: 35 }}>
                  <textarea
                    className="form-control"
                    value={customPayloadObj}
                    onChange={handlePayloadJson}
                  />
                  {jsonError && (
                    <span style={{ color: "red" }}>{jsonError}</span>
                  )}
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      `Custom payload can be any valid JSON value. To resolve a value from the original webhook payload use a JSON pointer wrapped with curly braces.

                        Example:
                            {
                            "entityId": "{ /payload/sys/id }",
                            "spaceId": "{ /payload/sys/space/sys/id }",
                            "parameters": {
                                "text": "Entity version: { /payload/sys/version }"
                            }
                        }`
                    )}
                  </small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ModalFooter>
        <button onClick={closeModal} className="btn btn-secondary">
          {languageManager.translate("CANCEL")}
        </button>
        <button
          type="button"
          className="btn btn-primary ajax-button"
          disabled={name.length > 0 && url.length > 0 ? false : true}
          onClick={submit}
        >
          <CircleSpinner show={spinner} size="small" />
          {!spinner && <span>{updateMode ? "Update" : "Create"}</span>}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomWebHook;
