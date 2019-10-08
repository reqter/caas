import React, { useState, useEffect, useRef } from "react";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalFooter from "reactstrap/lib/ModalFooter";
import { languageManager, utility, useGlobalState } from "services";
import { useLocale } from "hooks";
import {
  getTemplates,
  addContentType,
  updateContentType
} from "Api/contentType-api";
import "./styles.scss";
import AssetBrowser from "components/AssetBrowser";
import CircleSpinner from "components/CircleSpinner";
import Wrong from "components/Commons/ErrorsComponent/Wrong";

const currentLang = languageManager.getCurrentLanguage().name;
//
const UpsertTemplate = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const nameInput = useRef(null);
  const { locales, currentLocale, makeLocalesValue } = useLocale();

  const [spinner, setSpinner] = useState(false);
  const { updateMode } = props;
  const submitBtnText = !updateMode
    ? languageManager.translate("CONTENT_TYPE_MODAL_FOOTER_UPSERT_BTN_NEW")
    : languageManager.translate("CONTENT_TYPE_MODAL_FOOTER_UPSERT_BTN_EDIT");

  const selectedContentType = updateMode
    ? props.selectedContentType
    : undefined;

  const [isOpen, toggleModal] = useState(true);
  const [tmpSpinner, toggleTmpSpinner] = useState(updateMode ? false : true);
  const [error, setError] = useState();
  const [contentTypeTemplates, setTemplates] = useState();
  const [tab, changeTab] = useState(updateMode ? 2 : 1);
  const [selectedTemplate, setTemplate] = useState(
    updateMode ? props.selectedTemplate : {}
  );
  const [name, setName] = useState(
    selectedContentType ? selectedContentType.name : ""
  );
  const [title, setTitle] = useState(
    selectedContentType ? selectedContentType.title[currentLocale] : ""
  );
  const [description, setDescription] = useState(
    selectedContentType ? selectedContentType.description[currentLocale] : ""
  );
  const [media, setMedia] = useState(
    selectedContentType
      ? selectedContentType.media
        ? makeImages(selectedContentType.media)
        : []
      : []
  );
  const [assetBrowser, toggleAssetBrowser] = useState(false);

  useEffect(() => {
    if (tab === 1)
      getTemplates()
        .onOk(result => {
          toggleTmpSpinner(false);
          setTemplates(result);
        })
        .unKnownError(result => {
          toggleTmpSpinner(false);
          setError(true);
        })
        .call();
    return () => {
      if (!props.isOpen) toggleModal(false);
    };
  }, []);
  useEffect(() => {
    if (tab === 2) {
      nameInput.current.focus();
    }
  }, [tab]);

  function closeModal() {
    props.onCloseModal();
  }
  function handleChooseTemplate(tmp) {
    changeTab(2);
    setTemplate(tmp);
  }
  function backToTemplates() {
    if (!spinner) {
      changeTab(1);
      setTemplate({});
    }
  }
  function handleNameChanged(e) {
    setName(e.target.value);
  }
  function handleTitleChanged(e) {
    setTitle(e.target.value);
  }
  function handleDescriptionChanged(e) {
    setDescription(e.target.value);
  }

  function makeImages(imgs) {
    let result = [...imgs];
    const newArr = result.map(img => {
      let item = { ...img };
      item.id = Math.random();
      return item;
    });
    return newArr;
  }
  function upsertItemType() {
    if (!spinner) {
      setSpinner(true);

      if (updateMode) {
        let obj = {};
        for (const key in selectedContentType) {
          obj[key] = selectedContentType[key];
        }
        obj["name"] = name.toLowerCase();
        obj["title"] = makeLocalesValue(obj["title"], title);
        obj["description"] = makeLocalesValue(obj["description"], description);
        obj["media"] = media;

        updateContentType()
          .onOk(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate("CONTENT_TYPE_UPDATE_ON_OK")
              }
            });
            dispatch({
              type: "UPDATE_CONTENT_TYPE",
              value: result
            });
            props.onCloseModal(obj);
          })
          .onServerError(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_UPDATE_ON_SERVER_ERROR"
                )
              }
            });
          })
          .onBadRequest(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_UPDATE_ON_BAD_REQUEST"
                )
              }
            });
          })
          .unAuthorized(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: languageManager.translate(
                  "CONTENT_TYPE_UPDATE_UN_AUTHORIZED"
                )
              }
            });
          })
          .notFound(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_UPDATE_NOT_FOUND"
                )
              }
            });
          })
          .call(spaceInfo.id, obj);
      } else {
        let obj = {
          name: name.toLowerCase(),
          title: makeLocalesValue({}, title),
          description: makeLocalesValue({}, description),
          media: media,
          fields: [...selectedTemplate.fields],
          template: selectedTemplate.name,
          allowCustomFields: selectedTemplate.allowCustomFields
        };
        addContentType()
          .onOk(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate("CONTENT_TYPE_ADD_ON_OK")
              }
            });
            dispatch({
              type: "ADD_CONTENT_TYPE",
              value: result
            });
            props.onCloseModal(obj);
          })
          .onServerError(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_ADD_ON_SERVER_ERROR"
                )
              }
            });
          })
          .onBadRequest(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_ADD_ON_BAD_REQUEST"
                )
              }
            });
          })
          .unAuthorized(result => {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_ADD_UN_AUTHORIZED"
                )
              }
            });
          })
          .call(spaceInfo.id, obj);
      }
    }
  }
  function removeFile(image) {
    const m = media.filter(item => item.id !== image.id);
    setMedia(m);
  }
  function openAssetBrowser() {
    toggleAssetBrowser(true);
  }
  function handleChooseAsset(asset) {
    toggleAssetBrowser(false);
    if (asset) {
      let imgs = [];
      const obj = { ...asset.url, id: Math.random() };
      imgs.push(obj);
      setMedia(imgs);
    }
  }
  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      <ModalHeader toggle={closeModal}>
        {!updateMode
          ? languageManager.translate("ADD_NEW") +
            " " +
            (selectedTemplate
              ? selectedTemplate.title
                ? selectedTemplate.title[currentLang]
                : languageManager.translate("CONTENT_TYPE")
              : languageManager.translate("CONTENT_TYPE"))
          : languageManager.translate("EDIT") +
            " " +
            (selectedContentType ? selectedContentType.title[currentLang] : "")}
        {selectedContentType ? (
          <>
            <br />
            <span style={{ fontSize: 12 }}>{selectedContentType._id}</span>
          </>
        ) : (
          ""
        )}
      </ModalHeader>
      <ModalBody>
        <div className="c-category-templates-body">
          {tab === 1 && (
            <div className="fieldsTab">
              {tmpSpinner ? (
                <div className="tmpSpinner">
                  <CircleSpinner show={true} size="large" />
                  <span>Load templates...</span>
                </div>
              ) : error ? (
                <div className="tmpError">
                  <Wrong width={150} height={150} />
                  <h4>Error has ocurred!</h4>
                  <h6>Something getting wrong to load templates</h6>
                </div>
              ) : !contentTypeTemplates || contentTypeTemplates.length === 0 ? (
                <div className="emptyList animated fadeIn">
                  <i className="icon-empty-box-open icon" />
                  <span className="title">Empty List!</span>
                  <span className="info">
                    There are no templates to show...
                  </span>
                </div>
              ) : (
                contentTypeTemplates.map(tmp => (
                  <div
                    key={tmp.id}
                    className="add-field-types"
                    onClick={() => handleChooseTemplate(tmp)}
                  >
                    <div
                      className="add-field-icon"
                      style={{
                        backgroundColor:
                          selectedContentType &&
                          selectedContentType.template === tmp.name
                            ? "lightgray"
                            : "whitesmoke"
                      }}
                    >
                      <i className={tmp.icon ? tmp.icon : "icon-item-type"} />
                    </div>
                    <span className="title">{tmp.title[currentLang]}</span>
                    <span className="description">
                      {tmp.description[currentLang]}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 2 && (
            <div style={{ padding: "2%", paddingBottom: 0 }}>
              <div className="row">
                <div className="form-group col">
                  <label>
                    {languageManager.translate("CONTENT_TYPE_MODAL_NAME")}
                  </label>
                  <input
                    ref={nameInput}
                    type="text"
                    className="form-control"
                    placeholder={languageManager.translate(
                      "CONTENT_TYPE_MODAL_NAME_PLACEHOLDER"
                    )}
                    value={name}
                    required
                    onChange={handleNameChanged}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_MODAL_NAME_DESCRIPTION"
                    )}
                  </small>
                </div>

                <div className="form-group col">
                  <label>
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_TITLE"
                    )}
                  </label>
                  <input
                    className="form-control"
                    type="string"
                    value={title}
                    placeholder={languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_TITLE_PLACEHOLDER"
                    )}
                    onChange={handleTitleChanged}
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_TITLE_INFO"
                    )}
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label>
                  {languageManager.translate("CONTENT_TYPE_MODAL_DESCRIPTION")}
                </label>
                <input
                  className="form-control"
                  type="string"
                  placeholder={languageManager.translate(
                    "CONTENT_TYPE_MODAL_DESCRIPTION_PLACEHOLDER"
                  )}
                  value={description}
                  onChange={handleDescriptionChanged}
                />
              </div>
              <div className="up-uploader">
                <span className="title">
                  {languageManager.translate("CONTENT_TYPE_MODAL_IMAGES_TITLE")}
                </span>
                <span className="description">
                  {languageManager.translate("CONTENT_TYPE_MODAL_IMAGES_DESC")}
                </span>

                <div className="files">
                  {media.map((url, index) => (
                    <div key={index} className="files-uploaded">
                      <div
                        className="files-uploaded-icon"
                        onClick={() => removeFile(url)}
                      >
                        <i className="icon-bin" />
                      </div>
                      <div className="updatedFileType">
                        {utility.getAssetIconByURL(url[currentLocale])}
                      </div>
                    </div>
                  ))}
                  <div className="files-input" onClick={openAssetBrowser}>
                    <i className="icon-camera" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      {tab !== 1 ? (
        <ModalFooter>
          <button
            type="submit"
            className="btn btn-primary ajax-button"
            onClick={upsertItemType}
            disabled={
              name &&
              name.length > 0 &&
              title &&
              title.length > 0 &&
              !name.includes(" ")
                ? false
                : true
            }
          >
            {spinner && <CircleSpinner show={true} size="small" />}
            {!spinner && submitBtnText}
          </button>
          {!updateMode && (
            <button className="btn btn-secondary" onClick={backToTemplates}>
              {languageManager.translate("CONTENT_TYPE_MODAL_TEMPLATE_BTN")}
            </button>
          )}
        </ModalFooter>
      ) : (
        undefined
      )}

      {assetBrowser && (
        <AssetBrowser
          isOpen={assetBrowser}
          onCloseModal={handleChooseAsset}
          mediaType={["image"]}
        />
      )}
    </Modal>
  );
};

export default UpsertTemplate;
