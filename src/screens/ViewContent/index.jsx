import React, { useState, useEffect } from "react";
import "./styles.scss";
import {
  languageManager,
  useGlobalState,
  storageManager
} from "../../services";
import { getContentByLink } from "../../Api/content-api";
import { getUserInfo } from "../../Api/account-api";
import { NotFound, Wrong } from "../../components/Commons/ErrorsComponent";
import {
  String,
  Number,
  DateTime,
  Location,
  Boolean,
  KeyValue,
  RichText,
  Reference,
  JsonObject,
  AdvanceUploaderView
} from "../../components";
const currentLang = languageManager.getCurrentLanguage().name;
const ViewRequest = props => {
  const viewMode = true;
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const [tab, changeTab] = useState(1);
  const [currentBox, setCurrentBox] = useState("form");

  const [item, setItem] = useState();
  const [userInfo, setUserInfo] = useState();
  const [spinner, toggleSpinner] = useState(true);

  const [category, setCategory] = useState();
  const [contentType, setContentType] = useState();
  const [fields, setFields] = useState();

  // it will get value editing time
  const [selectedContent, setSelectedContent] = useState();

  const [formData, setFormData] = useState({});
  const [form, setForm] = useState({});
  const [formValidation, setFormValidation] = useState();
  const [error, setError] = useState(false);
  const [isValidForm, toggleIsValidForm] = useState(false);

  useEffect(() => {
    const { params } = props.match;
    if (!params.link) {
      const obj = {
        type: "WRONG_URL",
        title: "Wrong Url!",
        message: "Url is wrong.It has not request id"
      };
      setError(obj);
      toggleSpinner(false);
    } else {
      const token = storageManager.getItem("token");
      if (token) fetchUserInfo();
      getItemById(params.link);
    }
  }, [props.match.params.link]);

  useEffect(() => {
    if (Object.keys(form).length > 0 && checkFormValidation()) {
      toggleIsValidForm(true);
    } else toggleIsValidForm(false);
  }, [formValidation, category]);

  // methods
  function checkFormValidation() {
    for (const key in formValidation) {
      if (formValidation[key] === false) return false;
    }
    return true;
  }

  function fetchUserInfo() {
    getUserInfo()
      .onOk(result => {
        // if (result.profile && result.profile.avatar) {
        //   result.profile.avatar =
        //     process.env.REACT_APP_DOWNLOAD_FILE_BASE_URL +
        //     result.profile.avatar;
        // }
        setUserInfo(result);
      })
      .onServerError(result => {})
      .onBadRequest(result => {})
      .unAuthorized(result => {})
      .notFound(result => {})
      .onRequestError(result => {})
      .unKnownError(result => {})
      .call();
  }
  useEffect(() => {
    if (item) {
      const f = item.contentType.fields;
      setFields(f.sort((a, b) => a.index - b.index));
    }
  }, [item]);
  function getItemById(link) {
    getContentByLink()
      .onOk(result => {
        if (result) {
          if (!result.contentType) {
            const obj = {
              type: "CONTENT_TYPE",
              title: "Not Found!",
              message: "There is not content type for this content."
            };
            setError(obj);
          } else {
            if (!spaceInfo) {
              const space = { id: result.sys.spaceId };
              dispatch({
                type: "SET_SPACEINFO",
                value: space
              });
            }

            result.settings = {
              showHeader: true,
              showRequestInfo: true
            };
            setFormData(result.fields);
            setItem(result);
            setError();
          }
        } else setItem({});
        toggleSpinner(false);
      })
      .onServerError(result => {
        const obj = {
          type: "ON_SERVER_ERROR",
          title: "Server Error!",
          message: "Internal server error."
        };
        setError(obj);
        toggleSpinner(false);
      })
      .onBadRequest(result => {
        const obj = {
          type: "ON_SERVER_ERROR",
          title: "Bad Request",
          message: languageManager.translate("Bad Request")
        };
        setError(obj);
        toggleSpinner(false);
      })
      .unAuthorized(result => {
        const obj = {
          type: "ON_SERVER_ERROR",
          sender: "getItemById",
          message: languageManager.translate("")
        };
        setError(obj);
        toggleSpinner(false);
      })
      .notFound(() => {
        const obj = {
          type: "NOT_FOUND",
          title: "Not Found!",
          message: languageManager.translate("Request not found.")
        };
        setError(obj);
        toggleSpinner(false);
      })
      .onRequestError(() => {
        const obj = {
          type: "ON_SERVER_ERROR",
          title: "Request error",
          message: languageManager.translate(
            "There is an error like connection error."
          )
        };
        setError(obj);
        toggleSpinner(false);
      })
      .unKnownError(() => {
        const obj = {
          type: "ON_SERVER_ERROR",
          title: "Error has occured",
          message: languageManager.translate(
            "There is an error in your request"
          )
        };
        setError(obj);
        toggleSpinner(false);
      })
      .call(link);
  }
  function getFieldItem(field) {
    switch (field.type.toLowerCase()) {
      case "string":
        return <String viewMode={viewMode} field={field} formData={formData} />;
      case "number":
        return <Number viewMode={viewMode} field={field} formData={formData} />;
      case "datetime":
        return (
          <DateTime viewMode={viewMode} field={field} formData={formData} />
        );
      case "location":
        return (
          <Location viewMode={viewMode} field={field} formData={formData} />
        );
      case "media":
        return <AdvanceUploaderView formData={formData} field={field} />;
      case "boolean":
        return (
          <Boolean viewMode={viewMode} field={field} formData={formData} />
        );
      case "keyvalue":
        return (
          <KeyValue viewMode={viewMode} field={field} formData={formData} />
        );
      case "richtext":
        return (
          <RichText viewMode={viewMode} field={field} formData={formData} />
        );
      case "reference":
        return (
          <Reference viewMode={viewMode} field={field} formData={formData} />
        );
      case "jsonobject":
        return (
          <JsonObject viewMode={viewMode} field={field} formData={formData} />
        );
      default:
        break;
    }
  }

  function showProfile() {
    props.history.push("/panel/profile");
  }

  return spinner ? (
    <div className="loaderBox">
      <div className="loader" />
      Loading ...
    </div>
  ) : (
    <div className="viewRequest">
      {/* {item && item.settings && item.settings.showHeader === true && ( */}
      <div className="viewRequest--header">
        <div className="header--left">
          <div className="header--content-icon">
            <img
              src={require("./../../assets/logo.png")}
              alt=""
              className="logo"
            />
          </div>
          <div className="header--content-name">
            <span>REQTER</span>
          </div>
        </div>
        <div className="header--center" />
        <div className="header--right">
          {userInfo && (
            <div className="userinfo">
              <span>
                {(!userInfo.profile.first_name ||
                  userInfo.profile.first_name.length === 0) &&
                (!userInfo.profile.last_name ||
                  userInfo.profile.last_name.length === 0)
                  ? "Your name"
                  : userInfo.profile.first_name +
                    " " +
                    userInfo.profile.last_name}
              </span>
              {userInfo.profile.avatar && userInfo.profile.avatar.length > 0 ? (
                <div onClick={showProfile}>
                  <img src={userInfo.profile.avatar} />
                  {/* <Image url={userInfo.profile.avatar} /> */}
                </div>
              ) : (
                <div className="empty-avatar">?</div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* )} */}

      <div
        className="viewRequest--body"
        style={{
          paddingTop:
            item && item.settings && item.settings.showHeader === true ? 60 : 0
        }}
      >
        {error ? (
          <div className="viewRequest--error">
            <div>
              {error.type === "CONTENT_TYPE" || error.type === "NOT_FOUND" ? (
                <NotFound />
              ) : (
                <Wrong />
              )}
            </div>
            <div>{error.type === "WRONG_URL" && <Wrong />}</div>
            <span className="viewRequest--error-title">{error.title}</span>
            <span className="viewRequest--error-msg">{error.message}</span>
          </div>
        ) : (
          <div className="viewRequest-form">
            <div className="formContent">
              {item && item.settings && item.settings.showRequestInfo === true && (
                <div
                  className={
                    "content-userInfo " +
                    (item.settings && item.settings.showHeader === true
                      ? "userInfo_withHeader"
                      : "userInfo_noHeader")
                  }
                >
                  <div className="userImage">
                    <img
                      src="https://sitejerk.com/images/profile-image-png-17.png"
                      alt=""
                    />
                  </div>
                  <div className="info">
                    <span>
                      <strong>
                        {item && item.fields && item.fields["name"]}
                      </strong>
                    </span>
                    <span>{item.title && item.title[currentLang]}</span>
                  </div>
                 
                </div>
              )}
              <div
                className="content-inputs"
                style={{
                  marginTop:
                    item.settings &&
                    item.settings.showHeader === true &&
                    !item.settings.showRequestInfo
                      ? 20
                      : 0
                }}
              >
                {fields &&
                  fields.map(field => (
                    <div key={field.id} className="rowItem">
                      {getFieldItem(field)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequest;
