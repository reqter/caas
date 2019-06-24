import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { useGlobalState, languageManager } from "./../../services";
import { getAssetById, addAsset, updateAsset } from "./../../Api/asset-api";
import {
  String,
  Number,
  DateTime,
  Location,
  Media,
  Boolean,
  KeyValue,
  RichText,
  FileUploader,
  CircleSpinner,
  AssetUploaderView,
} from "./../../components";

const fields = [
  {
    id: "1",
    name: "title",
    title: {
      en: "Title",
      fa: "عنوان",
    },
    description: {
      en: "this will be apear on assets",
      fa: "نام فایل برای نمایش در لیست",
    },
    type: "string",
    isBase: true,
    isTranslate: true,
    isRequired: true,
  },
  {
    id: "2",
    name: "description",
    title: {
      en: "Description",
      fa: "توضیحات",
    },
    description: {
      en: "Short description of your file",
      fa: "توضیح کوتاه برای فایل",
    },
    type: "string",
    isBase: true,
    isTranslate: true,
  },
  {
    id: "3",
    name: "url",
    title: {
      fa: "Your File",
      en: "Your File",
    },
    description: {
      fa: "",
      en: "Click on file selector to choose your file",
    },
    type: "fileUploader",
    mediaType: "file",
    isBase: true,
    isTranslate: true,
    isRequired: true,
  },
];

const UpsertFile = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  // variables
  const [viewMode] = useState(props.match.url.includes("view") ? true : false);
  const [updateMode, toggleUpdateMode] = useState();
  const [tab, changeTab] = useState(); // tab1 ; form , tab2 : errors
  const [error, setError] = useState();
  const [spinner, toggleSpinner] = useState(false);
  const [closeSpinner, toggleCloseSpinner] = useState(false);
  const [formData, setFormData] = useState({});
  const [form, setForm] = useState();
  const [formValidation, setFormValidation] = useState();
  const [isFormValid, toggleIsValidForm] = useState();

  useEffect(() => {
    if (props.match.params.id !== undefined) {
      if (props.match.params.id.length > 0) {
        getAssetItemById(props.match.params.id);
        toggleUpdateMode(true);
      } else {
        const obj = {
          type: "wrongUrl",
          message: languageManager.translate("UPSERT_ASSET_WRONG_URL"),
        };
        // url is wrong
        changeTab(2);
        setError(obj);
      }
    } else {
      // creation mode
      toggleUpdateMode(false);
      changeTab(1);
    }
  }, [props.match.params.id]);

  useEffect(() => {
    if (form && checkFormValidation()) {
      toggleIsValidForm(true);
    } else toggleIsValidForm(false);
  }, [formValidation]);

  function checkFormValidation() {
    for (const key in formValidation) {
      if (formValidation[key] === false) return false;
    }
    return true;
  }

  // methods
  function getAssetItemById(id) {
    getAssetById()
      .onOk(result => {
        setForm(result);
        setFormData(result);
        changeTab(1);
      })
      .onServerError(result => {
        const obj = {
          type: "ON_SERVER_ERROR",
          message: languageManager.translate(
            "UPSERT_ASSET_GET_BY_ID_ON_SERVER_ERROR"
          ),
        };
        changeTab(2);
        setError(obj);
      })
      .onBadRequest(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate(
              "UPSERT_ASSET_GET_BY_ID_ON_BAD_REQUEST"
            ),
          },
        });
      })
      .unAuthorized(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: languageManager.translate(
              "UPSERT_ASSET_GET_BY_ID_UN_AUTHORIZED"
            ),
          },
        });
      })
      .notFound(result => {
        const obj = {
          type: "NOT_FOUND",
          message: languageManager.translate(
            "UPSERT_ASSET_GET_BY_ID_NOT_FOUND"
          ),
        };
        changeTab(2);
        setError(obj);
      })
      .call(spaceInfo ? spaceInfo.id : undefined, id);
  }
  function setNameToFormValidation(name, value) {
    if (!formValidation || formValidation[name] !== null) {
      setFormValidation(prevFormValidation => ({
        [name]: value,
        ...prevFormValidation,
      }));
    }
  }
  function handleOnChangeValue(field, value, isValid) {
    // check validation
    const { name: key } = field;

    // add value to form
    let f = {
      ...form,
    };
    if (value === undefined) {
      delete f[key];
      if (key === "url" && field.isBase) {
        delete f["fileType"];
        delete f["name"];
        delete f["title"];
      }
    } else {
      if (key === "url" && field.isBase) {
        f[key] = {
          en: value["en"],
          fa: value["fa"],
        };
        if (
          value.fileType.includes("image") ||
          value.fileType.includes("video") ||
          value.fileType.includes("audio")
        ) {
          f.fileType = value.fileType.split("/")[0];
        } else f.fileType = value.fileType;
        f.name = value["name"];
        f["title"] = {
          en: value["name"],
          fa: value["name"],
        };
      } else f[key] = value;
    }
    setForm(f);

    setFormValidation(prevFormValidation => ({
      ...prevFormValidation,
      [key]: isValid,
    }));
  }

  function getFieldItem(field) {
    switch (field.type.toLowerCase()) {
      case "string":
        return (
          <String
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "number":
        return (
          <Number
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "datetime":
        return (
          <DateTime
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "location":
        return (
          <Location
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "fileuploader":
        if (viewMode) {
          return (
            <AssetUploaderView
              viewMode={viewMode}
              formData={formData}
              field={field}
              init={setNameToFormValidation}
              onChangeValue={handleOnChangeValue}
            />
          );
        } else
          return (
            <FileUploader
              viewMode={viewMode}
              formData={formData}
              field={field}
              init={setNameToFormValidation}
              onChangeValue={handleOnChangeValue}
            />
          );
      case "keyvalue":
        return (
          <KeyValue
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "richtext":
        return (
          <RichText
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      default:
        break;
    }
  }
  function backToAssets() {
    props.history.push("/panel/assets");
  }

  function upsertItem(closePage) {
    if (!spinner) {
      if (closePage) {
        toggleCloseSpinner(true);
      } else {
        toggleSpinner(true);
      }
      if (updateMode) {
        updateAsset()
          .onOk(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate("UPSERT_ASSET_UPDATE_ON_OK"),
              },
            });
            if (closePage) {
              backToAssets();
            } else {
              setFormData({});
              setFormValidation();
            }
          })
          .onServerError(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "UPSERT_ASSET_UPDATE_ON_SERVER_ERROR"
                ),
              },
            });
          })
          .onBadRequest(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "UPSERT_ASSET_UPDATE_ON_BAD_REQUEST"
                ),
              },
            });
          })
          .unAuthorized(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: languageManager.translate(
                  "UPSERT_ASSET_UPDATE_UN_AUTHORIZED"
                ),
              },
            });
          })
          .notFound(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "UPSERT_ASSET_UPDATE_NOT_FOUND"
                ),
              },
            });
          })
          .call(spaceInfo.id, form);
      } else {
        const obj = {
          name: form.name,
          title: form.title,
          description: form.shortDesc,
          url: form.url,
          fileType: form.fileType,
        };
        addAsset()
          .onOk(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate("UPSERT_ASSET_ADD_ON_OK"),
              },
            });
            if (closePage) {
              backToAssets();
            } else {
              setFormData({});
              setForm({});
              const newObj = { ...formValidation };
              setFormValidation(newObj);
            }
          })
          .onServerError(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "UPSERT_ASSET_ADD_ON_SERVER_ERROR"
                ),
              },
            });
          })
          .onBadRequest(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "UPSERT_ASSET_ADD_ON_BAD_REQUEST"
                ),
              },
            });
          })
          .unAuthorized(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: languageManager.translate(
                  "UPSERT_ASSET_ADD_UN_AUTHORIZED"
                ),
              },
            });
          })
          .notFound(result => {
            if (closePage) {
              toggleCloseSpinner(false);
            } else {
              toggleSpinner(false);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "UPSERT_ASSET_ADD_NOT_FOUND"
                ),
              },
            });
          })
          .call(spaceInfo.id, obj);
      }
    }
  }
  function refreshCurrentPage() {
    window.location.reload();
  }
  return (
    <div className="up-file-wrapper">
      <div className="up-file-header">
        <button className="btn btn-light" onClick={backToAssets}>
          <i className="icon-arrow-left2" />
          {languageManager.translate("BACK")}
        </button>
        <div className="tabItems">
          <div className="item active">Asset</div>
        </div>
      </div>
      <div className="up-file-content">
        <main>
          {tab === 1 && (
            <>
              <div className="up-file-content-title">
                {viewMode
                  ? "View Mode"
                  : updateMode
                  ? languageManager.translate("UPSERT_ASSET_HEADER_EDIT_TITLE")
                  : languageManager.translate("UPSERT_ASSET_HEADER_ADD_TITLE")}
              </div>
              <div className="up-file-formInputs animated fadeIn">
                {fields.map(field => (
                  <div key={field.id} className="rowItem">
                    {getFieldItem(field)}
                  </div>
                ))}
                {!viewMode && (
                  <div className="upf-actions">
                    {!updateMode && (
                      <button
                        className="btn btn-primary ajax-button"
                        onClick={() => upsertItem(false)}
                        disabled={!isFormValid}
                      >
                        <CircleSpinner show={spinner} size="small" />
                        <span>Save & New</span>
                      </button>
                    )}
                    <button
                      className="btn btn-primary ajax-button"
                      onClick={() => upsertItem(true)}
                      disabled={!isFormValid}
                    >
                      <CircleSpinner show={closeSpinner} size="small" />
                      <span>
                        {updateMode ? "Update & Close" : "Save & Close"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {tab === 2 && error && (
            <div className="up-file-formInputs animated fadeIn errorsBox">
              <div className="alert alert-danger">{error.message}</div>
              <div className="actions">
                <button className="btn btn-light" onClick={refreshCurrentPage}>
                  {languageManager.translate(
                    "UPSERT_ASSET_ERROR_BOX_REFRESH_BTN"
                  )}
                </button>
                <button className="btn btn-light" onClick={backToAssets}>
                  {languageManager.translate(
                    "UPSERT_ASSET_ERROR_BOX_MEDIA_BTN"
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpsertFile;
