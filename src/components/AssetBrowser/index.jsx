import React, { useState, useEffect, useRef } from "react";
import Modal from "reactstrap/lib/Modal";
import String from "./../String";
import FileUploader from "./../FileUploader";
import AssetFile from "components/AssetFile";
import CircleSpinner from "components/CircleSpinner";
import { languageManager, useGlobalState } from "services";
import "./styles.scss";
import { useLocale } from "hooks";
import Loading from "components/Commons/Loading";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import CommonErrorAlert from "components/Commons/ErrorsComponent/CommonError";
import { filterAssets, addAsset } from "Api/asset-api";

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

const limit = 20;
const AssetBrowser = (props) => {
  const { currentLocale, makeLocalesValue } = useLocale();
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const [isOpen, toggleModal] = useState(props.isOpen);
  const [tab, changeTab] = useState(1);
  const [formData, setFormData] = useState({});
  const [form, setForm] = useState({});
  const [formValidation, setFormValidation] = useState();
  const [isValidForm, toggleIsValidForm] = useState();
  const [spinner, toggleSpinner] = useState(false);
  const [closeSpinner, toggleCloseSpinner] = useState(false);
  const [state, setState] = useState({
    skip: 0,
    assets: [],
    loading: true,
    error: false,
  });
  function updateSate(changes) {
    setState((prev) => ({ ...prev, ...changes }));
  }
  const { skip, assets, loading, error } = state;
  useEffect(() => {
    getAssetFiles(skip, limit);
    return () => {
      if (!props.isOpen) toggleModal(false);
    };
  }, []);
  const prevPage = () => {
    updateSate({ loading: true, skip: skip - 1 });
    getAssetFiles((skip - 1) * limit, limit);
  };
  const nextPage = () => {
    updateSate({ loading: true, skip: skip + 1 });
    getAssetFiles((skip + 1) * limit, limit);
  };

  useEffect(() => {
    if (Object.keys(form).length > 0 && checkFormValidation()) {
      toggleIsValidForm(true);
    } else toggleIsValidForm(false);
  }, [formValidation]);

  function checkFormValidation() {
    for (const key in formValidation) {
      if (formValidation[key] === false) return false;
    }
    return true;
  }

  function closeModal() {
    props.onCloseModal();
  }

  function getAssetFiles(skip, limit) {
    if (!loading) updateSate({ loading: false });
    const fileType =
      props.mediaType === undefined ||
      props.mediaType.length === 0 ||
      props.mediaType.length === "all"
        ? undefined
        : props.mediaType;

    filterAssets()
      .onOk((result) => {
        updateSate({ loading: false, error: false, assets: result });
      })
      .onServerError((result) => {
        updateSate({ loading: false, error: true });
      })
      .onBadRequest((result) => {
        updateSate({ loading: false, error: true });
      })
      .unAuthorized((result) => {
        updateSate({ loading: false, error: true });
      })
      .notFound((result) => {
        updateSate({ loading: false, error: true });
      })
      .call(spaceInfo.id, fileType, undefined, skip, limit);
  }
  function chooseFile(file) {
    props.onCloseModal(file);
  }

  function upsertItem(closePage) {
    if (!spinner) {
      if (closePage) {
        toggleCloseSpinner(true);
      } else {
        toggleSpinner(true);
      }

      const obj = {
        name: form.name,
        title: form.title,
        description: form.shortDesc,
        url: form.url,
        fileType: form.fileType,
      };
      addAsset()
        .onOk((result) => {
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
            changeTab(1);
            updateSate({ skip: 0 });
            getAssetFiles(0, limit);
          } else {
            setFormData({});
            setForm({});
            const newObj = { ...formValidation };
            setFormValidation(newObj);
          }
        })
        .onServerError((result) => {
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
        .onBadRequest((result) => {
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
        .unAuthorized((result) => {
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
        .notFound((result) => {
          if (closePage) {
            toggleCloseSpinner(false);
          } else {
            toggleSpinner(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("UPSERT_ASSET_ADD_NOT_FOUND"),
            },
          });
        })
        .call(spaceInfo.id, obj);
    }
  }
  //#region second tab
  function setNameToFormValidation(name, value) {
    if (!formValidation || formValidation[name] !== null) {
      setFormValidation((prevFormValidation) => ({
        [name]: value,
        ...prevFormValidation,
      }));
    }
  }
  function handleOnChangeValue(field, value, isValid) {
    // add value to form
    let f = {
      ...form,
    };
    const { name: key } = field;
    if (value === undefined) {
      delete f[key];
      if (key === "url" && field.isBase) {
        delete f["fileType"];
        delete f["name"];
        delete f["title"];
      }
    } else {
      if (key === "url" && field.isBase) {
        f["url"] = value["url"];
        f.fileType = value.fileType.split("/")[0];
        f.name = value["name"];
        f["title"] = makeLocalesValue({}, value["name"]);
      } else f[key] = value;
    }
    setForm(f);

    // check validation
    setFormValidation((prevFormValidation) => ({
      ...prevFormValidation,
      [key]: isValid,
    }));
  }
  //#endregion second tab

  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      <div className="modal_header_tab">
        <div className="left">
          <div
            className="tabItem"
            style={{
              background: tab === 1 ? "white" : "whitesmoke",
            }}
            onClick={() => changeTab(1)}
          >
            Media
          </div>
          <div
            className="tabItem"
            style={{
              background: tab === 2 ? "white" : "whitesmoke",
            }}
            onClick={() => changeTab(2)}
          >
            Upload New File
          </div>
        </div>
        <div className="right" onClick={closeModal}>
          <i className="icon-cross" />
        </div>
      </div>
      <div className="asset_browser">
        {tab === 1 && (
          <>
            <div className="asset_browser__pagination">
              {skip === 0 && assets.length < limit ? null : (
                <>
                  <button
                    className="pagination-btn btn-left"
                    disabled={skip === 0}
                    onClick={prevPage}
                  >
                    <i className="icon-circle-left" />
                  </button>
                  <span className="pagination-text">Page {skip + 1}</span>
                  <button
                    className="pagination-btn btn-right"
                    disabled={!assets || assets.length < limit}
                    onClick={nextPage}
                  >
                    <i className="icon-circle-right" />
                  </button>
                </>
              )}
            </div>
            <div className="firstTab animated fadeIn">
              {loading ? (
                <Loading />
              ) : error ? (
                <CommonErrorAlert text="There was an error to load assets list.try again" />
              ) : !assets || assets.length === 0 ? (
                <EmptyListIcon />
              ) : (
                assets.map((file) => (
                  <div
                    key={file.sys.id}
                    className="assetItem"
                    onClick={() => chooseFile(file)}
                  >
                    <div className="top">
                      {file.fileType.toLowerCase().includes("image") ? (
                        <img
                          src={
                            file.url
                              ? file.url[currentLocale]
                                ? file.url[currentLocale].replace(
                                    "https://app-spanel.herokuapp.com",
                                    "https://assets.reqter.com"
                                  )
                                : file.url
                                    .toString()
                                    .replace(
                                      "https://app-spanel.herokuapp.com",
                                      "https://assets.reqter.com"
                                    )
                              : null
                          }
                          alt=""
                        />
                      ) : file.fileType.toLowerCase().includes("video") ? (
                        <i className="icon-video" />
                      ) : file.fileType.toLowerCase().includes("audio") ? (
                        <i className="icon-audio" />
                      ) : file.fileType.toLowerCase().includes("pdf") ? (
                        <i className="icon-pdf" />
                      ) : file.fileType
                          .toLowerCase()
                          .includes("spreadsheet") ? (
                        <i className="icon-spreadsheet" />
                      ) : (
                        <AssetFile file={file} />
                      )}
                    </div>
                    <div className="bottom">
                      <div>{file.title[currentLocale]}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {tab === 2 && (
          <div className="secondTab animated fadeIn">
            <div className="newUpload">
              <String
                field={fields[0]}
                formData={formData}
                init={setNameToFormValidation}
                onChangeValue={handleOnChangeValue}
              />
              <String
                field={fields[1]}
                formData={formData}
                init={setNameToFormValidation}
                onChangeValue={handleOnChangeValue}
              />
              <FileUploader
                formData={formData}
                field={fields[2]}
                init={setNameToFormValidation}
                onChangeValue={handleOnChangeValue}
              />
            </div>
            <div className="actions">
              <button
                className="btn btn-primary ajax-button"
                onClick={() => upsertItem(false)}
                disabled={!isValidForm}
              >
                <CircleSpinner show={spinner} size="small" />
                Save & New
              </button>
              <button
                className="btn btn-primary ajax-button"
                onClick={() => upsertItem(true)}
                disabled={!isValidForm}
              >
                <CircleSpinner show={closeSpinner} size="small" />
                Save & Back
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssetBrowser;
